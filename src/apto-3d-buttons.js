const TOGGLE_SELECTOR = '[data-apto-toggle]';
const COMPLETE_SELECTOR = '[data-apto-complete]';
const BUTTON_SELECTOR = '.apto-3d-button';
const SLIDER_SELECTOR = '.apto-3d-slider input[type="range"]';
const TABS_SELECTOR = '[data-apto-tabs]';
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

export function syncApto3DSlider(input) {
  if (!input) return;

  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);
  const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const slider = input.closest('.apto-3d-slider');
  const output = slider?.querySelector('[data-apto-slider-output], .apto-3d-slider__output');

  input.style.setProperty('--apto-3d-slider-progress', `${Math.min(100, Math.max(0, progress))}%`);

  if (output) {
    const prefix = input.dataset.aptoSliderPrefix || '';
    const suffix = input.dataset.aptoSliderSuffix || '';
    output.value = `${prefix}${input.value}${suffix}`;
    output.textContent = output.value;
  }
}

export function activateAptoTab(tabs, tab, focus = false) {
  if (!tabs || !tab || tab.disabled) return;

  const tablist = tabs.querySelector(':scope > .apto-3d-tablist');
  const tabButtons = tablist ? [...tablist.querySelectorAll('[data-apto-tab]')] : [];

  tabButtons.forEach((button) => {
    const active = button === tab;
    const panelId = button.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;

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

  const tablist = tabs.querySelector(':scope > .apto-3d-tablist');
  if (!tablist) return;

  const tabButtons = [...tablist.querySelectorAll('[data-apto-tab]')];
  const initialTab = tabButtons.find((tab) => tab.getAttribute('aria-selected') === 'true' && !tab.disabled)
    || tabButtons.find((tab) => !tab.disabled);

  if (!initialTab) return;

  tabs.dataset.aptoTabsReady = 'true';
  activateAptoTab(tabs, initialTab);

  tabButtons.forEach((tab) => {
    tab.addEventListener('click', () => activateAptoTab(tabs, tab));
    tab.addEventListener('keydown', (event) => {
      const enabledTabs = tabButtons.filter((button) => !button.disabled);
      const currentIndex = enabledTabs.indexOf(tab);
      let nextTab = null;

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

  root.querySelectorAll(COMPLETE_SELECTOR).forEach((button) => {
    if (button.dataset.aptoCompleteReady === 'true') return;

    button.dataset.aptoCompleteReady = 'true';
    button.addEventListener('click', () => {
      completeButtonWithSuccess(button, {
        loadingMs: button.dataset.aptoLoadingMs,
        successMs: button.dataset.aptoSuccessMs
      });
    });
  });

  root.querySelectorAll(SLIDER_SELECTOR).forEach((input) => {
    syncApto3DSlider(input);

    if (input.dataset.aptoSliderReady === 'true') return;

    input.dataset.aptoSliderReady = 'true';
    input.addEventListener('input', () => syncApto3DSlider(input));
    input.addEventListener('change', () => syncApto3DSlider(input));
  });

  root.querySelectorAll(TABS_SELECTOR).forEach(initApto3DTabs);
}

if (typeof window !== 'undefined') {
  window.Apto3DButtons = {
    activateAptoTab,
    completeButtonWithSuccess,
    initApto3DButtons,
    resetAptoButton,
    setAptoButtonLoading,
    setAptoButtonSuccess,
    syncApto3DSlider
  };
}
