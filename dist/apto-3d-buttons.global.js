(function () {
  var TOGGLE_SELECTOR = '[data-apto-toggle]';
  var COMPLETE_SELECTOR = '[data-apto-complete]';

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

    root.querySelectorAll(TOGGLE_SELECTOR).forEach(function (button) {
      if (button.dataset.aptoReady === 'true') return;

      button.dataset.aptoReady = 'true';
      button.addEventListener('click', function () {
        var active = button.classList.toggle('is-active');
        button.setAttribute('aria-pressed', String(active));
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
