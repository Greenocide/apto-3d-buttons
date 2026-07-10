(function () {
  var TOGGLE_SELECTOR = '[data-apto-toggle]';
  var COMPLETE_SELECTOR = '[data-apto-complete]';
  var BUTTON_SELECTOR = '.apto-3d-button';
  var SLIDER_SELECTOR = '.apto-3d-slider input[type="range"]';
  var TABS_SELECTOR = '[data-apto-tabs]';
  var ACTIVE_VALUE_ATTRIBUTES = [
    ['aptoActiveIcon', 'activeIcon'],
    ['aptoActiveFill', 'activeFill'],
    ['aptoActiveStroke', 'activeStroke']
  ];

  function setAptoButtonLoading(button, loading) {
    if (!button) return;
    loading = loading !== false;

    button.classList.toggle('is-loading', loading);
    button.classList.remove('is-success');
    button.disabled = loading;
    button.setAttribute('aria-busy', String(loading));

    if (!loading) {
      button.removeAttribute('aria-busy');
    }
  }

  function setAptoButtonSuccess(button, success) {
    if (!button) return;
    success = success !== false;

    button.classList.toggle('is-success', success);
    button.classList.remove('is-loading');
    button.disabled = success;
    button.removeAttribute('aria-busy');
  }

  function resetAptoButton(button) {
    if (!button) return;

    button.classList.remove('is-loading', 'is-success');
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }

  function completeButtonWithSuccess(button, options) {
    options = options || {};
    var loadingMs = options.loadingMs == null ? 900 : Number(options.loadingMs);
    var successMs = options.successMs == null ? 900 : Number(options.successMs);

    setAptoButtonLoading(button, true);

    return new Promise(function (resolve) {
      window.setTimeout(function () {
        setAptoButtonSuccess(button, true);

        window.setTimeout(function () {
          resetAptoButton(button);
          resolve(button);
        }, successMs);
      }, loadingMs);
    });
  }

  function syncApto3DSlider(input) {
    if (!input) return;

    var min = Number(input.min || 0);
    var max = Number(input.max || 100);
    var value = Number(input.value);
    var progress = max === min ? 0 : ((value - min) / (max - min)) * 100;
    var slider = input.closest('.apto-3d-slider');
    var output = slider && slider.querySelector('[data-apto-slider-output], .apto-3d-slider__output');

    input.style.setProperty('--apto-3d-slider-progress', Math.min(100, Math.max(0, progress)) + '%');

    if (output) {
      var prefix = input.dataset.aptoSliderPrefix || '';
      var suffix = input.dataset.aptoSliderSuffix || '';
      output.value = prefix + input.value + suffix;
      output.textContent = output.value;
    }
  }

  function activateAptoTab(tabs, tab, focus) {
    if (!tabs || !tab || tab.disabled) return;
    focus = focus === true;

    var tablist = tabs.querySelector(':scope > .apto-3d-tablist');
    var tabButtons = tablist ? Array.prototype.slice.call(tablist.querySelectorAll('[data-apto-tab]')) : [];

    tabButtons.forEach(function (button) {
      var active = button === tab;
      var panelId = button.getAttribute('aria-controls');
      var panel = panelId ? document.getElementById(panelId) : null;

      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;

      if (panel && tabs.contains(panel)) {
        panel.hidden = !active;
      }
    });

    if (focus) tab.focus();
  }

  function initApto3DTabs(tabs) {
    if (tabs.dataset.aptoTabsReady === 'true') return;

    var tablist = tabs.querySelector(':scope > .apto-3d-tablist');
    if (!tablist) return;

    var tabButtons = Array.prototype.slice.call(tablist.querySelectorAll('[data-apto-tab]'));
    var initialTab = tabButtons.find(function (tab) {
      return tab.getAttribute('aria-selected') === 'true' && !tab.disabled;
    }) || tabButtons.find(function (tab) {
      return !tab.disabled;
    });

    if (!initialTab) return;

    tabs.dataset.aptoTabsReady = 'true';
    activateAptoTab(tabs, initialTab);

    tabButtons.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateAptoTab(tabs, tab);
      });

      tab.addEventListener('keydown', function (event) {
        var enabledTabs = tabButtons.filter(function (button) {
          return !button.disabled;
        });
        var currentIndex = enabledTabs.indexOf(tab);
        var nextTab = null;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextTab = enabledTabs[(currentIndex + 1) % enabledTabs.length];
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextTab = enabledTabs[(currentIndex - 1 + enabledTabs.length) % enabledTabs.length];
        } else if (event.key === 'Home') {
          nextTab = enabledTabs[0];
        } else if (event.key === 'End') {
          nextTab = enabledTabs[enabledTabs.length - 1];
        }

        if (nextTab) {
          event.preventDefault();
          activateAptoTab(tabs, nextTab, true);
        }
      });
    });
  }

  function initApto3DButtons(root) {
    root = root || document;

    root.querySelectorAll(BUTTON_SELECTOR).forEach(function (button) {
      syncActiveColorVariables(button, button);

      button.querySelectorAll('[data-apto-active-icon], [data-apto-active-fill], [data-apto-active-stroke]').forEach(function (element) {
        syncActiveColorVariables(element, element);
      });

      applyAptoActiveSvgPaint(button, button.classList.contains('is-active'));
    });

    root.querySelectorAll(TOGGLE_SELECTOR).forEach(function (button) {
      if (button.dataset.aptoReady === 'true') return;

      button.dataset.aptoReady = 'true';
      button.addEventListener('click', function () {
        var active = button.classList.toggle('is-active');
        button.setAttribute('aria-pressed', String(active));
        applyAptoActiveSvgPaint(button, active);
      });
    });

    root.querySelectorAll(COMPLETE_SELECTOR).forEach(function (button) {
      if (button.dataset.aptoCompleteReady === 'true') return;

      button.dataset.aptoCompleteReady = 'true';
      button.addEventListener('click', function () {
        completeButtonWithSuccess(button, {
          loadingMs: button.dataset.aptoLoadingMs,
          successMs: button.dataset.aptoSuccessMs
        });
      });
    });

    root.querySelectorAll(SLIDER_SELECTOR).forEach(function (input) {
      syncApto3DSlider(input);

      if (input.dataset.aptoSliderReady === 'true') return;

      input.dataset.aptoSliderReady = 'true';
      input.addEventListener('input', function () {
        syncApto3DSlider(input);
      });
      input.addEventListener('change', function () {
        syncApto3DSlider(input);
      });
    });

    root.querySelectorAll(TABS_SELECTOR).forEach(initApto3DTabs);
  }

  function syncActiveColorVariables(source, target) {
    ACTIVE_VALUE_ATTRIBUTES.forEach(function (item) {
      var dataKey = item[0];
      var cssName = item[1];
      var value = source.dataset[dataKey];

      if (value) {
        target.style.setProperty('--apto-3d-' + cssName.replace(/[A-Z]/g, function (letter) {
          return '-' + letter.toLowerCase();
        }), value);
      }
    });
  }

  function setActiveStyleProperty(element, property, value) {
    var propertyKey = property.charAt(0).toUpperCase() + property.slice(1);
    var savedKey = 'aptoOriginal' + propertyKey + 'Saved';
    var valueKey = 'aptoOriginal' + propertyKey;
    var priorityKey = 'aptoOriginal' + propertyKey + 'Priority';

    if (element.dataset[savedKey] !== 'true') {
      element.dataset[savedKey] = 'true';
      element.dataset[valueKey] = element.style.getPropertyValue(property);
      element.dataset[priorityKey] = element.style.getPropertyPriority(property);
    }

    element.style.setProperty(property, value, 'important');
  }

  function restoreActiveStyleProperty(element, property) {
    var propertyKey = property.charAt(0).toUpperCase() + property.slice(1);
    var savedKey = 'aptoOriginal' + propertyKey + 'Saved';
    var valueKey = 'aptoOriginal' + propertyKey;
    var priorityKey = 'aptoOriginal' + propertyKey + 'Priority';

    if (element.dataset[savedKey] !== 'true') return;

    var originalValue = element.dataset[valueKey] || '';
    var originalPriority = element.dataset[priorityKey] || '';

    if (originalValue) {
      element.style.setProperty(property, originalValue, originalPriority);
    } else {
      element.style.removeProperty(property);
    }
  }

  function getClosestActiveValue(button, element, attribute, dataKey) {
    var owner = element.closest('[' + attribute + ']');

    if (owner && button.contains(owner) && owner !== button) {
      return owner.dataset[dataKey];
    }

    return button.dataset[dataKey] || '';
  }

  function applyAptoActiveSvgPaint(button, active) {
    var iconTargets = button.querySelectorAll('svg, svg *, i');

    iconTargets.forEach(function (element) {
      if (!active) {
        restoreActiveStyleProperty(element, 'color');
        restoreActiveStyleProperty(element, 'fill');
        restoreActiveStyleProperty(element, 'stroke');
        return;
      }

      var activeIcon = getClosestActiveValue(button, element, 'data-apto-active-icon', 'aptoActiveIcon');
      var activeFill = getClosestActiveValue(button, element, 'data-apto-active-fill', 'aptoActiveFill');
      var activeStroke = getClosestActiveValue(button, element, 'data-apto-active-stroke', 'aptoActiveStroke');

      if (activeIcon && element.matches('svg, i')) {
        setActiveStyleProperty(element, 'color', activeIcon);
      }

      if (element.matches('svg, svg *')) {
        if (activeFill) setActiveStyleProperty(element, 'fill', activeFill);
        if (activeStroke) setActiveStyleProperty(element, 'stroke', activeStroke);
      }
    });
  }

  window.Apto3DButtons = {
    activateAptoTab: activateAptoTab,
    completeButtonWithSuccess: completeButtonWithSuccess,
    initApto3DButtons: initApto3DButtons,
    resetAptoButton: resetAptoButton,
    setAptoButtonLoading: setAptoButtonLoading,
    setAptoButtonSuccess: setAptoButtonSuccess,
    syncApto3DSlider: syncApto3DSlider
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initApto3DButtons();
    });
  } else {
    initApto3DButtons();
  }
})();
