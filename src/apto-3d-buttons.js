const TOGGLE_SELECTOR = '[data-apto-toggle]';
const ACTIVE_OPTION_SELECTOR = [
  '.apto-3d-button[data-apto-active-icon]',
  '.apto-3d-button[data-apto-active-fill]',
  '.apto-3d-button[data-apto-active-stroke]'
].join(',');

function applyAptoButtonOptions(root = document) {
  root.querySelectorAll(ACTIVE_OPTION_SELECTOR).forEach((button) => {
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
}

function setSvgPaintProperty(element, property, value) {
  const savedKey = property === 'fill' ? 'aptoOriginalFillSaved' : 'aptoOriginalStrokeSaved';
  const valueKey = property === 'fill' ? 'aptoOriginalFill' : 'aptoOriginalStroke';
  const priorityKey = property === 'fill' ? 'aptoOriginalFillPriority' : 'aptoOriginalStrokePriority';

  if (element.dataset[savedKey] !== 'true') {
    element.dataset[savedKey] = 'true';
    element.dataset[valueKey] = element.style.getPropertyValue(property);
    element.dataset[priorityKey] = element.style.getPropertyPriority(property);
  }

  element.style.setProperty(property, value, 'important');
}

function restoreSvgPaintProperty(element, property) {
  const savedKey = property === 'fill' ? 'aptoOriginalFillSaved' : 'aptoOriginalStrokeSaved';
  const valueKey = property === 'fill' ? 'aptoOriginalFill' : 'aptoOriginalStroke';
  const priorityKey = property === 'fill' ? 'aptoOriginalFillPriority' : 'aptoOriginalStrokePriority';

  if (element.dataset[savedKey] !== 'true') return;

  const originalValue = element.dataset[valueKey] || '';
  const originalPriority = element.dataset[priorityKey] || '';

  if (originalValue) {
    element.style.setProperty(property, originalValue, originalPriority);
  } else {
    element.style.removeProperty(property);
  }
}

function applyAptoActiveSvgPaint(button, active) {
  const activeFill = button.dataset.aptoActiveFill;
  const activeStroke = button.dataset.aptoActiveStroke;

  if (!activeFill && !activeStroke) return;

  button.querySelectorAll('svg, svg *').forEach((element) => {
    if (active) {
      if (activeFill) setSvgPaintProperty(element, 'fill', activeFill);
      if (activeStroke) setSvgPaintProperty(element, 'stroke', activeStroke);
    } else {
      if (activeFill) restoreSvgPaintProperty(element, 'fill');
      if (activeStroke) restoreSvgPaintProperty(element, 'stroke');
    }
  });
}

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
  applyAptoButtonOptions(root);

  root.querySelectorAll(TOGGLE_SELECTOR).forEach((button) => {
    if (button.dataset.aptoReady === 'true') return;

    button.dataset.aptoReady = 'true';
    button.addEventListener('click', () => {
      const active = button.classList.toggle('is-active');
      button.setAttribute('aria-pressed', String(active));
      applyAptoActiveSvgPaint(button, active);
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
