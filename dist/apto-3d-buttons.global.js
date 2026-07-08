(function () {
  var TOGGLE_SELECTOR = '[data-apto-toggle]';
  var COMPLETE_SELECTOR = '[data-apto-complete]';
  var ACTIVE_OPTION_SELECTOR = [
    '.apto-3d-button[data-apto-active-icon]',
    '.apto-3d-button[data-apto-active-fill]',
    '.apto-3d-button[data-apto-active-stroke]'
  ].join(',');

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

    root.querySelectorAll(ACTIVE_OPTION_SELECTOR).forEach(function (button) {
      if (button.dataset.aptoActiveIcon) {
        button.style.setProperty('--apto-3d-active-icon', button.dataset.aptoActiveIcon);
      }

      if (button.dataset.aptoActiveFill) {
        button.style.setProperty('--apto-3d-active-fill', button.dataset.aptoActiveFill);
      }

      if (button.dataset.aptoActiveStroke) {
        button.style.setProperty('--apto-3d-active-stroke', button.dataset.aptoActiveStroke);
      }

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

  function setSvgPaintProperty(element, property, value) {
    var savedKey = property === 'fill' ? 'aptoOriginalFillSaved' : 'aptoOriginalStrokeSaved';
    var valueKey = property === 'fill' ? 'aptoOriginalFill' : 'aptoOriginalStroke';
    var priorityKey = property === 'fill' ? 'aptoOriginalFillPriority' : 'aptoOriginalStrokePriority';

    if (element.dataset[savedKey] !== 'true') {
      element.dataset[savedKey] = 'true';
      element.dataset[valueKey] = element.style.getPropertyValue(property);
      element.dataset[priorityKey] = element.style.getPropertyPriority(property);
    }

    element.style.setProperty(property, value, 'important');
  }

  function restoreSvgPaintProperty(element, property) {
    var savedKey = property === 'fill' ? 'aptoOriginalFillSaved' : 'aptoOriginalStrokeSaved';
    var valueKey = property === 'fill' ? 'aptoOriginalFill' : 'aptoOriginalStroke';
    var priorityKey = property === 'fill' ? 'aptoOriginalFillPriority' : 'aptoOriginalStrokePriority';

    if (element.dataset[savedKey] !== 'true') return;

    var originalValue = element.dataset[valueKey] || '';
    var originalPriority = element.dataset[priorityKey] || '';

    if (originalValue) {
      element.style.setProperty(property, originalValue, originalPriority);
    } else {
      element.style.removeProperty(property);
    }
  }

  function applyAptoActiveSvgPaint(button, active) {
    var activeFill = button.dataset.aptoActiveFill;
    var activeStroke = button.dataset.aptoActiveStroke;

    if (!activeFill && !activeStroke) return;

    button.querySelectorAll('svg, svg *').forEach(function (element) {
      if (active) {
        if (activeFill) setSvgPaintProperty(element, 'fill', activeFill);
        if (activeStroke) setSvgPaintProperty(element, 'stroke', activeStroke);
      } else {
        if (activeFill) restoreSvgPaintProperty(element, 'fill');
        if (activeStroke) restoreSvgPaintProperty(element, 'stroke');
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
