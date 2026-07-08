const TOGGLE_SELECTOR = '[data-apto-toggle]';
const BUTTON_SELECTOR = '.apto-3d-button';
const ACTIVE_VALUE_ATTRIBUTES = [
  ['aptoActiveIcon', 'activeIcon'],
  ['aptoActiveFill', 'activeFill'],
  ['aptoActiveStroke', 'activeStroke']
];

function applyAptoButtonOptions(root = document) {
  root.querySelectorAll(BUTTON_SELECTOR).forEach((button) => {
    syncActiveColorVariables(button, button);

    button.querySelectorAll('[data-apto-active-icon], [data-apto-active-fill], [data-apto-active-stroke]').forEach((element) => {
      syncActiveColorVariables(element, element);
    });

    applyAptoActiveSvgPaint(button, button.classList.contains('is-active'));
  });
}

function syncActiveColorVariables(source, target) {
  ACTIVE_VALUE_ATTRIBUTES.forEach(([dataKey, cssName]) => {
    const value = source.dataset[dataKey];

    if (value) {
      target.style.setProperty(`--apto-3d-${cssName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value);
    }
  });
}

function setActiveStyleProperty(element, property, value) {
  const propertyKey = property.charAt(0).toUpperCase() + property.slice(1);
  const savedKey = `aptoOriginal${propertyKey}Saved`;
  const valueKey = `aptoOriginal${propertyKey}`;
  const priorityKey = `aptoOriginal${propertyKey}Priority`;

  if (element.dataset[savedKey] !== 'true') {
    element.dataset[savedKey] = 'true';
    element.dataset[valueKey] = element.style.getPropertyValue(property);
    element.dataset[priorityKey] = element.style.getPropertyPriority(property);
  }

  element.style.setProperty(property, value, 'important');
}

function restoreActiveStyleProperty(element, property) {
  const propertyKey = property.charAt(0).toUpperCase() + property.slice(1);
  const savedKey = `aptoOriginal${propertyKey}Saved`;
  const valueKey = `aptoOriginal${propertyKey}`;
  const priorityKey = `aptoOriginal${propertyKey}Priority`;

  if (element.dataset[savedKey] !== 'true') return;

  const originalValue = element.dataset[valueKey] || '';
  const originalPriority = element.dataset[priorityKey] || '';

  if (originalValue) {
    element.style.setProperty(property, originalValue, originalPriority);
  } else {
    element.style.removeProperty(property);
  }
}

function getClosestActiveValue(button, element, attribute, dataKey) {
  const owner = element.closest(`[${attribute}]`);

  if (owner && button.contains(owner) && owner !== button) {
    return owner.dataset[dataKey];
  }

  return button.dataset[dataKey] || '';
}

function applyAptoActiveSvgPaint(button, active) {
  const iconTargets = button.querySelectorAll('svg, svg *, i');

  iconTargets.forEach((element) => {
    if (!active) {
      restoreActiveStyleProperty(element, 'color');
      restoreActiveStyleProperty(element, 'fill');
      restoreActiveStyleProperty(element, 'stroke');
      return;
    }

    const activeIcon = getClosestActiveValue(button, element, 'data-apto-active-icon', 'aptoActiveIcon');
    const activeFill = getClosestActiveValue(button, element, 'data-apto-active-fill', 'aptoActiveFill');
    const activeStroke = getClosestActiveValue(button, element, 'data-apto-active-stroke', 'aptoActiveStroke');

    if (activeIcon && element.matches('svg, i')) {
      setActiveStyleProperty(element, 'color', activeIcon);
    }

    if (element.matches('svg, svg *')) {
      if (activeFill) setActiveStyleProperty(element, 'fill', activeFill);
      if (activeStroke) setActiveStyleProperty(element, 'stroke', activeStroke);
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
