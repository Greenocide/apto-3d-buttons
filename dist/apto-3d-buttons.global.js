(function () {
  var TOGGLE_SELECTOR = '[data-apto-toggle]';
  var COMPLETE_SELECTOR = '[data-apto-complete]';
  var BUTTON_SELECTOR = '.apto-3d-button';
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
    completeButtonWithSuccess: completeButtonWithSuccess,
    initApto3DButtons: initApto3DButtons,
    resetAptoButton: resetAptoButton,
    setAptoButtonLoading: setAptoButtonLoading,
    setAptoButtonSuccess: setAptoButtonSuccess
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initApto3DButtons();
    });
  } else {
    initApto3DButtons();
  }
})();
