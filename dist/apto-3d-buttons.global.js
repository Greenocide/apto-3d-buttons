(function () {
  var TOGGLE_SELECTOR = '[data-apto-toggle]';
  var COMPLETE_SELECTOR = '[data-apto-complete]';
  var BUTTON_SELECTOR = '.apto-3d-button';
  var SLIDER_SELECTOR = '.apto-3d-slider input[type="range"]';
  var RANGE_SELECTOR = '.apto-3d-range';
  var TABS_SELECTOR = '[data-apto-tabs]';
  var TRISTATE_SELECTOR = 'input[type="checkbox"][data-apto-tristate]';
  var SLIDER_PRESS_KEYS = [
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'End',
    'Home',
    'PageDown',
    'PageUp'
  ];
  var SLIDER_THUMB_SIZE = 24;
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

  function clampAptoValue(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getAptoRangeMetrics(input) {
    var min = Number(input.min || 0);
    var max = Number(input.max || 100);
    var value = clampAptoValue(Number(input.value), min, max);
    var progress = max === min ? 0 : ((value - min) / (max - min)) * 100;

    return { max: max, min: min, progress: progress, value: value };
  }

  function getAptoFormattedValue(input, value, aria) {
    value = value == null ? input.value : value;
    aria = aria === true;

    var prefix = aria && input.dataset.aptoSliderAriaPrefix != null
      ? input.dataset.aptoSliderAriaPrefix
      : (input.dataset.aptoSliderPrefix || '');
    var suffix = aria && input.dataset.aptoSliderAriaSuffix != null
      ? input.dataset.aptoSliderAriaSuffix
      : (input.dataset.aptoSliderSuffix || '');

    if (aria && input.dataset.aptoSliderAriaSuffix == null && suffix.trim() === '%') {
      suffix = ' percent';
    }

    return prefix + value + suffix;
  }

  function getAptoThumbPosition(input, progress) {
    var width = input.clientWidth;
    if (!width) return progress + '%';

    var radius = SLIDER_THUMB_SIZE / 2;
    var travel = Math.max(0, width - SLIDER_THUMB_SIZE);
    return radius + (travel * progress / 100) + 'px';
  }

  function ensureAptoBubble(owner, selector, className, handle) {
    var bubble = owner.querySelector(selector);

    if (!bubble) {
      bubble = document.createElement('span');
      bubble.className = className;
      bubble.setAttribute('aria-hidden', 'true');
      if (handle) bubble.dataset.aptoRangeBubble = handle;
      owner.append(bubble);
    }

    return bubble;
  }

  function setAptoSliderPressState(input, active, ownerClass) {
    var owner = input.closest('.apto-3d-slider, .apto-3d-range');

    input.classList.toggle('is-pressing', active);
    if (owner) owner.classList.toggle(ownerClass, active);
  }

  function bindAptoSliderFeedback(input, sync, ownerClass) {
    function stop() {
      setAptoSliderPressState(input, false, ownerClass);
    }

    function start() {
      if (input.disabled) return;
      setAptoSliderPressState(input, true, ownerClass);
      sync();
    }

    input.addEventListener('pointerdown', function () {
      start();

      function endPointer() {
        stop();
        window.removeEventListener('pointerup', endPointer);
        window.removeEventListener('pointercancel', endPointer);
      }

      window.addEventListener('pointerup', endPointer);
      window.addEventListener('pointercancel', endPointer);
    });

    input.addEventListener('keydown', function (event) {
      if (SLIDER_PRESS_KEYS.indexOf(event.key) === -1 || input.disabled) return;

      window.clearTimeout(input.aptoSliderPressTimer);
      start();
      window.requestAnimationFrame(sync);
    });

    input.addEventListener('keyup', function (event) {
      if (SLIDER_PRESS_KEYS.indexOf(event.key) === -1) return;

      window.clearTimeout(input.aptoSliderPressTimer);
      input.aptoSliderPressTimer = window.setTimeout(stop, 120);
    });

    input.addEventListener('blur', stop);
  }

  function syncApto3DSlider(input) {
    if (!input) return;

    var slider = input.closest('.apto-3d-slider');
    if (!slider) return;

    var metrics = getAptoRangeMetrics(input);
    var position = getAptoThumbPosition(input, metrics.progress);
    var output = slider.querySelector('[data-apto-slider-output], .apto-3d-slider__output');
    var formattedValue = getAptoFormattedValue(input);
    var ariaValue = getAptoFormattedValue(input, input.value, true);

    input.style.setProperty('--apto-3d-slider-progress', position);
    slider.style.setProperty('--apto-3d-slider-bubble-position', position);
    input.setAttribute('aria-valuetext', ariaValue);

    if (output) {
      output.value = formattedValue;
      output.textContent = formattedValue;
    }

    if (input.dataset.aptoSliderBubble !== 'false') {
      var bubble = ensureAptoBubble(slider, '.apto-3d-slider__bubble', 'apto-3d-slider__bubble');
      bubble.textContent = formattedValue;
    } else {
      var oldBubble = slider.querySelector('.apto-3d-slider__bubble');
      if (oldBubble) oldBubble.remove();
    }

  }

  function getAptoRangeFormattedValue(range, value, aria) {
    aria = aria === true;
    var prefixKey = aria ? 'aptoRangeAriaPrefix' : 'aptoRangePrefix';
    var suffixKey = aria ? 'aptoRangeAriaSuffix' : 'aptoRangeSuffix';
    var prefix = range.dataset[prefixKey] != null
      ? range.dataset[prefixKey]
      : (range.dataset.aptoRangePrefix || '');
    var suffix = range.dataset[suffixKey] != null
      ? range.dataset[suffixKey]
      : (range.dataset.aptoRangeSuffix || '');

    if (aria && range.dataset.aptoRangeAriaSuffix == null && suffix.trim() === '%') {
      suffix = ' percent';
    }

    return prefix + value + suffix;
  }

  function syncApto3DRange(range, changedInput) {
    if (!range) return;
    changedInput = changedInput || null;

    var minInput = range.querySelector('[data-apto-range-min]');
    var maxInput = range.querySelector('[data-apto-range-max]');
    if (!minInput || !maxInput) return;

    var minValue = Number(minInput.value);
    var maxValue = Number(maxInput.value);

    if (minValue > maxValue) {
      if (changedInput === maxInput) {
        maxValue = minValue;
        maxInput.value = String(maxValue);
      } else {
        minValue = maxValue;
        minInput.value = String(minValue);
      }
    }

    var boundsMin = Number(minInput.min || 0);
    var boundsMax = Number(minInput.max || 100);
    var span = boundsMax - boundsMin;
    var start = span ? ((minValue - boundsMin) / span) * 100 : 0;
    var end = span ? ((maxValue - boundsMin) / span) * 100 : 100;
    var minPosition = getAptoThumbPosition(minInput, start);
    var maxPosition = getAptoThumbPosition(maxInput, end);
    var output = range.querySelector('[data-apto-range-output], .apto-3d-range__output');
    var separator = range.dataset.aptoRangeSeparator || ' – ';
    var minText = getAptoRangeFormattedValue(range, minInput.value);
    var maxText = getAptoRangeFormattedValue(range, maxInput.value);

    range.style.setProperty('--apto-3d-range-start', clampAptoValue(start, 0, 100) + '%');
    range.style.setProperty('--apto-3d-range-end', clampAptoValue(end, 0, 100) + '%');
    range.style.setProperty('--apto-3d-range-min-position', minPosition);
    range.style.setProperty('--apto-3d-range-max-position', maxPosition);
    minInput.setAttribute('aria-valuetext', getAptoRangeFormattedValue(range, minInput.value, true));
    maxInput.setAttribute('aria-valuetext', getAptoRangeFormattedValue(range, maxInput.value, true));

    if (output) {
      output.value = minText + separator + maxText;
      output.textContent = output.value;
    }

    var minBubble = ensureAptoBubble(
      range,
      '[data-apto-range-bubble="min"]',
      'apto-3d-range__bubble',
      'min'
    );
    var maxBubble = ensureAptoBubble(
      range,
      '[data-apto-range-bubble="max"]',
      'apto-3d-range__bubble',
      'max'
    );
    minBubble.textContent = minText;
    maxBubble.textContent = maxText;

    if (changedInput === minInput) {
      minInput.style.zIndex = '5';
      maxInput.style.zIndex = '4';
    } else if (changedInput === maxInput) {
      minInput.style.zIndex = '4';
      maxInput.style.zIndex = '5';
    }
  }

  function setAptoCheckboxState(input, state) {
    if (!input) return;

    var normalized = ['checked', 'mixed', 'unchecked'].indexOf(state) !== -1
      ? state
      : 'unchecked';

    input.checked = normalized === 'checked';
    input.indeterminate = normalized === 'mixed';
    input.dataset.aptoTristate = normalized;
    input.setAttribute('aria-checked', normalized === 'mixed' ? 'mixed' : String(input.checked));
  }

  function initAptoTriState(input) {
    if (input.dataset.aptoTristateReady === 'true') return;

    var configuredState = input.dataset.aptoTristate;
    var initialState = ['checked', 'mixed', 'unchecked'].indexOf(configuredState) !== -1
      ? configuredState
      : (input.indeterminate ? 'mixed' : (input.checked ? 'checked' : 'unchecked'));

    input.dataset.aptoTristateReady = 'true';
    setAptoCheckboxState(input, initialState);

    input.addEventListener('click', function (event) {
      event.preventDefault();

      var current = input.dataset.aptoTristate;
      var next = current === 'mixed'
        ? 'unchecked'
        : (current === 'unchecked' ? 'checked' : 'mixed');

      setAptoCheckboxState(input, next);
      window.clearTimeout(input.aptoTristateTimer);
      input.aptoTristateTimer = window.setTimeout(function () {
        setAptoCheckboxState(input, next);
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }, 0);
    });
  }

  function getAptoSteppedValue(input, rawValue) {
    var min = Number(input.min || 0);
    var max = Number(input.max || 100);
    var step = input.step && input.step !== 'any' ? Number(input.step) : 1;
    var stepped = min + (Math.round((rawValue - min) / step) * step);
    var precision = (String(step).split('.')[1] || '').length;

    return Number(clampAptoValue(stepped, min, max).toFixed(precision));
  }

  function initApto3DRange(range) {
    var minInput = range.querySelector('[data-apto-range-min]');
    var maxInput = range.querySelector('[data-apto-range-max]');
    var track = range.querySelector('.apto-3d-range__track');

    if (!minInput || !maxInput || !track) return;

    syncApto3DRange(range);
    if (range.dataset.aptoRangeReady === 'true') return;

    range.dataset.aptoRangeReady = 'true';

    [minInput, maxInput].forEach(function (input) {
      var handle = input === minInput ? 'min' : 'max';
      var sync = function () {
        syncApto3DRange(range, input);
      };

      input.addEventListener('input', sync);
      input.addEventListener('change', sync);
      bindAptoSliderFeedback(input, sync, 'is-' + handle + '-interacting');
    });

    track.addEventListener('pointerdown', function (event) {
      if (event.target.closest('input[type="range"]')) return;
      if (minInput.disabled && maxInput.disabled) return;

      var rect = track.getBoundingClientRect();
      var radius = SLIDER_THUMB_SIZE / 2;
      var travel = Math.max(1, rect.width - SLIDER_THUMB_SIZE);
      var fromLeft = clampAptoValue(event.clientX - rect.left - radius, 0, travel);
      var rtl = getComputedStyle(range).direction === 'rtl';
      var ratio = rtl ? 1 - (fromLeft / travel) : fromLeft / travel;
      var rawValue = Number(minInput.min || 0)
        + (ratio * (Number(minInput.max || 100) - Number(minInput.min || 0)));
      var value = getAptoSteppedValue(minInput, rawValue);
      var minDistance = Math.abs(value - Number(minInput.value));
      var maxDistance = Math.abs(value - Number(maxInput.value));
      var target = (minDistance <= maxDistance && !minInput.disabled) || maxInput.disabled
        ? minInput
        : maxInput;

      target.value = String(value);
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.focus();
    });

    if (typeof ResizeObserver !== 'undefined') {
      var observer = new ResizeObserver(function () {
        syncApto3DRange(range);
      });
      observer.observe(track);
      range.aptoRangeResizeObserver = observer;
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
      bindAptoSliderFeedback(input, function () {
        syncApto3DSlider(input);
      }, 'is-interacting');

      if (typeof ResizeObserver !== 'undefined') {
        var observer = new ResizeObserver(function () {
          syncApto3DSlider(input);
        });
        observer.observe(input);
        input.aptoSliderResizeObserver = observer;
      }
    });

    root.querySelectorAll(RANGE_SELECTOR).forEach(initApto3DRange);
    root.querySelectorAll(TRISTATE_SELECTOR).forEach(initAptoTriState);
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
    setAptoCheckboxState: setAptoCheckboxState,
    setAptoButtonLoading: setAptoButtonLoading,
    setAptoButtonSuccess: setAptoButtonSuccess,
    syncApto3DRange: syncApto3DRange,
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
