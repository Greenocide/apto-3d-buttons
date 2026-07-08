const TOGGLE_SELECTOR = '[data-apto-toggle]';

export function setAptoButtonLoading(button, loading = true) {
  if (!button) return;

  button.classList.toggle('is-loading', loading);
  button.classList.remove('is-success');
  button.disabled = loading;
  button.setAttribute('aria-busy', String(loading));

  if (!loading) {
    button.removeAttribute('aria-busy');
  }
}

export function setAptoButtonSuccess(button, success = true) {
  if (!button) return;

  button.classList.toggle('is-success', success);
  button.classList.remove('is-loading');
  button.disabled = success;
  button.removeAttribute('aria-busy');
}

export function resetAptoButton(button) {
  if (!button) return;

  button.classList.remove('is-loading', 'is-success');
  button.disabled = false;
  button.removeAttribute('aria-busy');
}

export function completeButtonWithSuccess(button, options = {}) {
  const loadingMs = options.loadingMs ?? 900;
  const successMs = options.successMs ?? 900;

  setAptoButtonLoading(button, true);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      setAptoButtonSuccess(button, true);

      window.setTimeout(() => {
        resetAptoButton(button);
        resolve(button);
      }, successMs);
    }, loadingMs);
  });
}

export function initApto3DButtons(root = document) {
  root.querySelectorAll(TOGGLE_SELECTOR).forEach((button) => {
    if (button.dataset.aptoReady === 'true') return;

    button.dataset.aptoReady = 'true';
    button.addEventListener('click', () => {
      const active = button.classList.toggle('is-active');
      button.setAttribute('aria-pressed', String(active));
    });
  });
}

if (typeof window !== 'undefined') {
  window.Apto3DButtons = {
    completeButtonWithSuccess,
    initApto3DButtons,
    resetAptoButton,
    setAptoButtonLoading,
    setAptoButtonSuccess
  };
}
