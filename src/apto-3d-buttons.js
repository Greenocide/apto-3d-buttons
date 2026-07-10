const TOGGLE_SELECTOR = '[data-apto-toggle]';
const COMPLETE_SELECTOR = '[data-apto-complete]';
const BUTTON_SELECTOR = '.apto-3d-button';
const SLIDER_SELECTOR = '.apto-3d-slider input[type="range"]';
const RANGE_SELECTOR = '.apto-3d-range';
const TABS_SELECTOR = '[data-apto-tabs]';
const TRISTATE_SELECTOR = 'input[type="checkbox"][data-apto-tristate]';
const SLIDER_PRESS_KEYS = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp'
]);
const SLIDER_THUMB_SIZE = 24;
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

function clampAptoValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getAptoRangeMetrics(input) {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = clampAptoValue(Number(input.value), min, max);
  const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return { max, min, progress, value };
}

function getAptoFormattedValue(input, value = input.value, aria = false) {
  const prefix = aria && input.dataset.aptoSliderAriaPrefix != null
    ? input.dataset.aptoSliderAriaPrefix
    : (input.dataset.aptoSliderPrefix || '');
  let suffix = aria && input.dataset.aptoSliderAriaSuffix != null
    ? input.dataset.aptoSliderAriaSuffix
    : (input.dataset.aptoSliderSuffix || '');

  if (aria && input.dataset.aptoSliderAriaSuffix == null && suffix.trim() === '%') {
    suffix = ' percent';
  }

  return `${prefix}${value}${suffix}`;
}

function getAptoThumbPosition(input, progress) {
  const width = input.clientWidth;

  if (!width) return `${progress}%`;

  const radius = SLIDER_THUMB_SIZE / 2;
  const travel = Math.max(0, width - SLIDER_THUMB_SIZE);
  return `${radius + (travel * progress / 100)}px`;
}

function ensureAptoBubble(owner, selector, className, handle) {
  let bubble = owner.querySelector(selector);

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
  const owner = input.closest('.apto-3d-slider, .apto-3d-range');

  input.classList.toggle('is-pressing', active);
  owner?.classList.toggle(ownerClass, active);
}

function bindAptoSliderFeedback(input, sync, ownerClass) {
  const stop = () => setAptoSliderPressState(input, false, ownerClass);
  const start = () => {
    if (input.disabled) return;
    setAptoSliderPressState(input, true, ownerClass);
    sync();
  };

  input.addEventListener('pointerdown', () => {
    start();

    const endPointer = () => {
      stop();
      window.removeEventListener('pointerup', endPointer);
      window.removeEventListener('pointercancel', endPointer);
    };

    window.addEventListener('pointerup', endPointer);
    window.addEventListener('pointercancel', endPointer);
  });

  input.addEventListener('keydown', (event) => {
    if (!SLIDER_PRESS_KEYS.has(event.key) || input.disabled) return;

    window.clearTimeout(input.aptoSliderPressTimer);
    start();
    window.requestAnimationFrame(sync);
  });

  input.addEventListener('keyup', (event) => {
    if (!SLIDER_PRESS_KEYS.has(event.key)) return;

    window.clearTimeout(input.aptoSliderPressTimer);
    input.aptoSliderPressTimer = window.setTimeout(stop, 120);
  });

  input.addEventListener('blur', stop);
}

export function syncApto3DSlider(input) {
  if (!input) return;

  const slider = input.closest('.apto-3d-slider');
  if (!slider) return;

  const { progress } = getAptoRangeMetrics(input);
  const position = getAptoThumbPosition(input, progress);
  const output = slider.querySelector('[data-apto-slider-output], .apto-3d-slider__output');
  const formattedValue = getAptoFormattedValue(input);
  const ariaValue = getAptoFormattedValue(input, input.value, true);

  input.style.setProperty('--apto-3d-slider-progress', position);
  slider.style.setProperty('--apto-3d-slider-bubble-position', position);
  input.setAttribute('aria-valuetext', ariaValue);

  if (output) {
    output.value = formattedValue;
    output.textContent = formattedValue;
  }

  if (input.dataset.aptoSliderBubble !== 'false') {
    const bubble = ensureAptoBubble(
      slider,
      '.apto-3d-slider__bubble',
      'apto-3d-slider__bubble'
    );
    bubble.textContent = formattedValue;
  } else {
    slider.querySelector('.apto-3d-slider__bubble')?.remove();
  }

}

function getAptoRangeFormattedValue(range, value, aria = false) {
  const prefixKey = aria ? 'aptoRangeAriaPrefix' : 'aptoRangePrefix';
  const suffixKey = aria ? 'aptoRangeAriaSuffix' : 'aptoRangeSuffix';
  const prefix = range.dataset[prefixKey] != null
    ? range.dataset[prefixKey]
    : (range.dataset.aptoRangePrefix || '');
  let suffix = range.dataset[suffixKey] != null
    ? range.dataset[suffixKey]
    : (range.dataset.aptoRangeSuffix || '');

  if (aria && range.dataset.aptoRangeAriaSuffix == null && suffix.trim() === '%') {
    suffix = ' percent';
  }

  return `${prefix}${value}${suffix}`;
}

export function syncApto3DRange(range, changedInput = null) {
  if (!range) return;

  const minInput = range.querySelector('[data-apto-range-min]');
  const maxInput = range.querySelector('[data-apto-range-max]');
  if (!minInput || !maxInput) return;

  let minValue = Number(minInput.value);
  let maxValue = Number(maxInput.value);

  if (minValue > maxValue) {
    if (changedInput === maxInput) {
      maxValue = minValue;
      maxInput.value = String(maxValue);
    } else {
      minValue = maxValue;
      minInput.value = String(minValue);
    }
  }

  const boundsMin = Number(minInput.min || 0);
  const boundsMax = Number(minInput.max || 100);
  const span = boundsMax - boundsMin;
  const start = span ? ((minValue - boundsMin) / span) * 100 : 0;
  const end = span ? ((maxValue - boundsMin) / span) * 100 : 100;
  const minPosition = getAptoThumbPosition(minInput, start);
  const maxPosition = getAptoThumbPosition(maxInput, end);
  const output = range.querySelector('[data-apto-range-output], .apto-3d-range__output');
  const separator = range.dataset.aptoRangeSeparator || ' – ';
  const minText = getAptoRangeFormattedValue(range, minInput.value);
  const maxText = getAptoRangeFormattedValue(range, maxInput.value);

  range.style.setProperty('--apto-3d-range-start', `${clampAptoValue(start, 0, 100)}%`);
  range.style.setProperty('--apto-3d-range-end', `${clampAptoValue(end, 0, 100)}%`);
  range.style.setProperty('--apto-3d-range-min-position', minPosition);
  range.style.setProperty('--apto-3d-range-max-position', maxPosition);
  minInput.setAttribute('aria-valuetext', getAptoRangeFormattedValue(range, minInput.value, true));
  maxInput.setAttribute('aria-valuetext', getAptoRangeFormattedValue(range, maxInput.value, true));

  if (output) {
    output.value = `${minText}${separator}${maxText}`;
    output.textContent = output.value;
  }

  const minBubble = ensureAptoBubble(
    range,
    '[data-apto-range-bubble="min"]',
    'apto-3d-range__bubble',
    'min'
  );
  const maxBubble = ensureAptoBubble(
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

export function setAptoCheckboxState(input, state) {
  if (!input) return;

  const normalized = ['checked', 'mixed', 'unchecked'].includes(state)
    ? state
    : 'unchecked';

  input.checked = normalized === 'checked';
  input.indeterminate = normalized === 'mixed';
  input.dataset.aptoTristate = normalized;
  input.setAttribute('aria-checked', normalized === 'mixed' ? 'mixed' : String(input.checked));
}

function initAptoTriState(input) {
  if (input.dataset.aptoTristateReady === 'true') return;

  const configuredState = input.dataset.aptoTristate;
  const initialState = ['checked', 'mixed', 'unchecked'].includes(configuredState)
    ? configuredState
    : (input.indeterminate ? 'mixed' : (input.checked ? 'checked' : 'unchecked'));

  input.dataset.aptoTristateReady = 'true';
  setAptoCheckboxState(input, initialState);

  input.addEventListener('click', (event) => {
    event.preventDefault();

    const current = input.dataset.aptoTristate;
    const next = current === 'mixed'
      ? 'unchecked'
      : (current === 'unchecked' ? 'checked' : 'mixed');

    setAptoCheckboxState(input, next);
    window.clearTimeout(input.aptoTristateTimer);
    input.aptoTristateTimer = window.setTimeout(() => {
      setAptoCheckboxState(input, next);
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, 0);
  });
}

function getAptoSteppedValue(input, rawValue) {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const step = input.step && input.step !== 'any' ? Number(input.step) : 1;
  const stepped = min + (Math.round((rawValue - min) / step) * step);
  const precision = (String(step).split('.')[1] || '').length;

  return Number(clampAptoValue(stepped, min, max).toFixed(precision));
}

function initApto3DRange(range) {
  const minInput = range.querySelector('[data-apto-range-min]');
  const maxInput = range.querySelector('[data-apto-range-max]');
  const track = range.querySelector('.apto-3d-range__track');

  if (!minInput || !maxInput || !track) return;

  syncApto3DRange(range);
  if (range.dataset.aptoRangeReady === 'true') return;

  range.dataset.aptoRangeReady = 'true';

  [minInput, maxInput].forEach((input) => {
    const handle = input === minInput ? 'min' : 'max';
    const sync = () => syncApto3DRange(range, input);

    input.addEventListener('input', sync);
    input.addEventListener('change', sync);
    bindAptoSliderFeedback(input, sync, `is-${handle}-interacting`);
  });

  track.addEventListener('pointerdown', (event) => {
    if (event.target.closest('input[type="range"]')) return;
    if (minInput.disabled && maxInput.disabled) return;

    const rect = track.getBoundingClientRect();
    const radius = SLIDER_THUMB_SIZE / 2;
    const travel = Math.max(1, rect.width - SLIDER_THUMB_SIZE);
    const fromLeft = clampAptoValue(event.clientX - rect.left - radius, 0, travel);
    const rtl = getComputedStyle(range).direction === 'rtl';
    const ratio = rtl ? 1 - (fromLeft / travel) : fromLeft / travel;
    const rawValue = Number(minInput.min || 0)
      + (ratio * (Number(minInput.max || 100) - Number(minInput.min || 0)));
    const value = getAptoSteppedValue(minInput, rawValue);
    const minDistance = Math.abs(value - Number(minInput.value));
    const maxDistance = Math.abs(value - Number(maxInput.value));
    const target = (minDistance <= maxDistance && !minInput.disabled) || maxInput.disabled
      ? minInput
      : maxInput;

    target.value = String(value);
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.focus();
  });

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => syncApto3DRange(range));
    observer.observe(track);
    range.aptoRangeResizeObserver = observer;
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
    bindAptoSliderFeedback(input, () => syncApto3DSlider(input), 'is-interacting');

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => syncApto3DSlider(input));
      observer.observe(input);
      input.aptoSliderResizeObserver = observer;
    }
  });

  root.querySelectorAll(RANGE_SELECTOR).forEach(initApto3DRange);
  root.querySelectorAll(TRISTATE_SELECTOR).forEach(initAptoTriState);
  root.querySelectorAll(TABS_SELECTOR).forEach(initApto3DTabs);
}

if (typeof window !== 'undefined') {
  window.Apto3DButtons = {
    activateAptoTab,
    completeButtonWithSuccess,
    initApto3DButtons,
    resetAptoButton,
    setAptoCheckboxState,
    setAptoButtonLoading,
    setAptoButtonSuccess,
    syncApto3DRange,
    syncApto3DSlider
  };
}
