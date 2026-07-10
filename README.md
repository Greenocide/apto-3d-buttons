# Apto 3D Buttons

Reusable push buttons loaded from jsDelivr. Include both files on every site: the CSS draws the buttons, and the JS initializes loading/toggle helpers.

## Install

Paste these two tags in your page, WordPress header/footer, Custom HTML area, or site builder embed:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.4.1/dist/apto-3d-buttons.css">
<script src="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.4.1/dist/apto-3d-buttons.global.js" defer></script>
```

Use the version tag URL in production. For quick testing, you can use `@main`, but tagged versions are safer.

## Theme Resistance

The component classes use stronger selectors and reset common theme effects on Apto controls, including hover backgrounds, box shadows, text shadows, filters, transforms, and text decoration. Load the Apto CSS after your theme CSS when possible.

## Basic Button

```html
<button class="apto-3d-button apto-3d-button--violet" type="button">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Push me</span>
  </span>
</button>
```

## Preset Colors

Use one color class with the base class:

```html
<button class="apto-3d-button apto-3d-button--green" type="button">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Continue</span>
  </span>
</button>
```

Available color presets:

- `apto-3d-button--rose`
- `apto-3d-button--red`
- `apto-3d-button--orange`
- `apto-3d-button--amber`
- `apto-3d-button--green`
- `apto-3d-button--cyan`
- `apto-3d-button--blue`
- `apto-3d-button--violet`
- `apto-3d-button--slate`
- `apto-3d-button--primary`
- `apto-3d-button--success`
- `apto-3d-button--danger`
- `apto-3d-button--ghost`
- `apto-3d-button--like`

## Sizes

```html
<button class="apto-3d-button apto-3d-button--rose apto-3d-button--sm" type="button">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Small</span>
  </span>
</button>

<button class="apto-3d-button apto-3d-button--blue apto-3d-button--lg" type="button">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Large</span>
  </span>
</button>
```

Available size/layout classes:

- `apto-3d-button--sm`
- `apto-3d-button--lg`
- `apto-3d-button--icon`

## Icon Button

Icon buttons contain `svg`, `i`, and `img` elements automatically. SVG active colors can target fill, stroke, or both.

```html
<button class="apto-3d-button apto-3d-button--icon apto-3d-button--blue" type="button" aria-label="Play">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">
      <svg class="apto-3d-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6 4l14 8-14 8V4z"></path>
      </svg>
    </span>
  </span>
</button>
```

Plain `<i>` and `<img>` icons are also contained:

```html
<button class="apto-3d-button apto-3d-button--icon apto-3d-button--amber" type="button" aria-label="Favorite">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">
      <i aria-hidden="true">A</i>
    </span>
  </span>
</button>

<button class="apto-3d-button apto-3d-button--icon apto-3d-button--cyan" type="button" aria-label="Image icon">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">
      <img src="/icon.svg" alt="">
    </span>
  </span>
</button>
```

## Checkbox

The input is real, so its checked value works with HTML forms, WordPress forms, labels, validation, and keyboard controls.

```html
<label class="apto-3d-checkbox apto-3d-checkbox--success">
  <input type="checkbox" name="updates" value="yes">
  <span class="apto-3d-checkbox__box" aria-hidden="true">
    <span class="apto-3d-checkbox__front"></span>
  </span>
  <span class="apto-3d-checkbox__label">Email updates</span>
</label>
```

Native `checked` and `disabled` attributes work directly. JavaScript can also set the native indeterminate state:

```js
document.querySelector('#select-all').indeterminate = true;
```

## Switch

The switch is also a native checkbox. Add `role="switch"` so assistive technology announces its purpose correctly.

```html
<label class="apto-3d-switch apto-3d-switch--primary">
  <input type="checkbox" name="notifications" role="switch" checked>
  <span class="apto-3d-switch__track" aria-hidden="true">
    <span class="apto-3d-switch__front"></span>
  </span>
  <span class="apto-3d-switch__label">Notifications</span>
</label>
```

Checkbox and switch presets use the same names as buttons: `rose`, `red`, `orange`, `amber`, `green`, `cyan`, `blue`, `violet`, `slate`, plus `primary`, `success`, and `danger`.

Custom colors can be applied inline or in a class using these variables:

```html
<label class="apto-3d-switch" style="--apto-3d-control-bg: #ec4899; --apto-3d-control-edge: #9d174d; --apto-3d-control-focus: #db2777;">
  <input type="checkbox" name="custom-setting" role="switch">
  <span class="apto-3d-switch__track" aria-hidden="true"><span class="apto-3d-switch__front"></span></span>
  <span class="apto-3d-switch__label">Custom setting</span>
</label>
```

## Slider

Use a native range input inside `apto-3d-slider`. The required library JS initializes the filled track and keeps the optional output synchronized.

```html
<label class="apto-3d-slider apto-3d-slider--primary">
  <span class="apto-3d-slider__header">
    <span class="apto-3d-slider__label">Volume</span>
    <output class="apto-3d-slider__output" data-apto-slider-output></output>
  </span>
  <input type="range" name="volume" min="0" max="100" value="65" data-apto-slider-suffix="%">
</label>
```

The input supports native `min`, `max`, `step`, `value`, and `disabled` attributes. Optional `data-apto-slider-prefix` and `data-apto-slider-suffix` values format the output. If JavaScript changes the value directly, synchronize it with:

```js
window.Apto3DButtons.syncApto3DSlider(rangeInput);
```

Custom slider variables are `--apto-3d-slider-bg`, `--apto-3d-slider-edge`, `--apto-3d-slider-focus`, `--apto-3d-slider-off-bg`, `--apto-3d-slider-off-edge`, and `--apto-3d-slider-thumb`.

## Scrollbar

Apply the scrollbar class to any element with constrained dimensions. The class supplies `overflow: auto`.

```html
<div class="apto-3d-scrollbar apto-3d-scrollbar--violet" style="max-height: 240px;">
  <!-- Scrollable content -->
</div>
```

Custom scrollbar variables are `--apto-3d-scrollbar-bg`, `--apto-3d-scrollbar-edge`, and `--apto-3d-scrollbar-track`.

Sliders and scrollbars support the same `rose`, `red`, `orange`, `amber`, `green`, `cyan`, `blue`, `violet`, `slate`, `primary`, `success`, and `danger` preset names.

## Radio Selection

Use real radio inputs with a shared `name`. Their values submit normally and native arrow-key selection continues to work.

```html
<fieldset>
  <legend>Choose a plan</legend>

  <label class="apto-3d-radio apto-3d-radio--primary">
    <input type="radio" name="plan" value="starter" checked>
    <span class="apto-3d-radio__control" aria-hidden="true">
      <span class="apto-3d-radio__front"></span>
    </span>
    <span class="apto-3d-radio__label">Starter</span>
  </label>

  <label class="apto-3d-radio apto-3d-radio--success">
    <input type="radio" name="plan" value="pro">
    <span class="apto-3d-radio__control" aria-hidden="true">
      <span class="apto-3d-radio__front"></span>
    </span>
    <span class="apto-3d-radio__label">Pro</span>
  </label>
</fieldset>
```

## Tabs

Tabs provide radio-like single selection for switching views. The required JS updates `aria-selected`, panel visibility, focus, and arrow-key navigation.

```html
<div class="apto-3d-tabs apto-3d-tabs--primary" data-apto-tabs>
  <div class="apto-3d-tablist" role="tablist" aria-label="Account sections">
    <button class="apto-3d-tab" type="button" role="tab" id="profile-tab" aria-controls="profile-panel" aria-selected="true" data-apto-tab>
      <span class="apto-3d-tab__front">Profile</span>
    </button>
    <button class="apto-3d-tab" type="button" role="tab" id="security-tab" aria-controls="security-panel" aria-selected="false" data-apto-tab>
      <span class="apto-3d-tab__front">Security</span>
    </button>
  </div>

  <div class="apto-3d-tabpanels">
    <section class="apto-3d-tabpanel" id="profile-panel" role="tabpanel" aria-labelledby="profile-tab">Profile content</section>
    <section class="apto-3d-tabpanel" id="security-panel" role="tabpanel" aria-labelledby="security-tab" hidden>Security content</section>
  </div>
</div>
```

Radio and tab presets use the same color names as the other controls. Custom radios use `--apto-3d-radio-bg`, `--apto-3d-radio-edge`, `--apto-3d-radio-focus`, and `--apto-3d-radio-mark`. Custom tabs use `--apto-3d-tab-bg`, `--apto-3d-tab-edge`, `--apto-3d-tab-text`, and `--apto-3d-tab-focus`.

## Loading Button

For a simple loading-to-success interaction, add `data-apto-complete`:

```html
<button class="apto-3d-button apto-3d-button--green" type="button" data-apto-complete>
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Submit</span>
  </span>
</button>
```

Optional timing:

```html
<button class="apto-3d-button apto-3d-button--green" type="button" data-apto-complete data-apto-loading-ms="1200" data-apto-success-ms="900">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Submit</span>
  </span>
</button>
```

For real AJAX/form logic, call the global helper yourself:

```html
<button class="apto-3d-button apto-3d-button--green" type="button" id="saveButton">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Save</span>
  </span>
</button>

<script>
  document.getElementById('saveButton').addEventListener('click', async (event) => {
    const button = event.currentTarget;
    window.Apto3DButtons.setAptoButtonLoading(button, true);

    await fetch('/your-endpoint', { method: 'POST' });

    window.Apto3DButtons.setAptoButtonSuccess(button, true);
    setTimeout(() => window.Apto3DButtons.resetAptoButton(button), 900);
  });
</script>
```

## Toggle Button

Add `data-apto-toggle`. The JS toggles `is-active` and keeps `aria-pressed` updated.

Active toggle buttons remain at the pressed depth until toggled off. This applies to both `is-active` and `aria-pressed="true"` states without changing the button's outer dimensions.

For text buttons that should swap background and text color when active, add `apto-3d-button--active-swap`:

```html
<button class="apto-3d-button apto-3d-button--primary apto-3d-button--active-swap" type="button" aria-pressed="false" data-apto-toggle>
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Primary Toggle</span>
  </span>
</button>
```

The normal color presets include active-swap colors with contrast. You can override them with:

```css
.apto-3d-button--brand {
  --apto-3d-active-bg: #ffffff;
  --apto-3d-active-text: #1e3a8a;
  --apto-3d-active-edge: #bfdbfe;
}
```

```html
<button class="apto-3d-button apto-3d-button--icon apto-3d-button--like" type="button" aria-label="Like" aria-pressed="false" data-apto-toggle>
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">
      <svg class="apto-3d-icon heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" data-apto-active-icon="#be123c" data-apto-active-fill="#be123c" data-apto-active-stroke="#be123c">
        <path d="M12 21s-7.2-4.35-9.7-9C.8 8 2.3 4 6 4c2 0 4 1.5 6 4 2-2.5 4-4 6-4 3.7 0 5.2 4 3.7 8-2.5 4.65-9.7 9-9.7 9z"></path>
      </svg>
    </span>
  </span>
</button>
```

Active icon buttons keep the same button colors and only change the icon. Put the data attributes on the icon itself:

- `<i>`: use `data-apto-active-icon`
- SVG fill: use `data-apto-active-fill`
- SVG stroke: use `data-apto-active-stroke`

For an SVG that should change both fill and stroke:

```html
<button class="apto-3d-button apto-3d-button--icon apto-3d-button--blue" type="button" aria-label="Favorite" aria-pressed="false" data-apto-toggle>
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">
      <svg class="apto-3d-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" data-apto-active-fill="#facc15" data-apto-active-stroke="#facc15">
        <path d="M12 17.3l-5.2 3 1.4-5.8-4.5-3.9 6-.5L12 4.6l2.3 5.5 6 .5-4.5 3.9 1.4 5.8z"></path>
      </svg>
    </span>
  </span>
</button>
```

When active, the JS sets SVG fill/stroke directly on the SVG and child shapes, so normal SVG `fill` and `stroke` attributes are overridden.

For an `<i>` icon:

```html
<button class="apto-3d-button apto-3d-button--icon apto-3d-button--amber" type="button" aria-label="Favorite" aria-pressed="false" data-apto-toggle>
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">
      <i aria-hidden="true" data-apto-active-icon="#7c2d12">A</i>
    </span>
  </span>
</button>
```

Button-level attributes still work as a fallback, but icon-level attributes are the recommended API. You can also set CSS variables directly:

```html
<button class="apto-3d-button apto-3d-button--icon apto-3d-button--blue" style="--apto-3d-active-fill: #facc15; --apto-3d-active-stroke: #facc15;" type="button" aria-label="Favorite" aria-pressed="false" data-apto-toggle>
  ...
</button>
```

## Custom Preset

Create your own class by setting CSS variables:

```html
<style>
  .apto-3d-button--brand {
    --apto-3d-bg: #2563eb;
    --apto-3d-edge: #1e3a8a;
    --apto-3d-text: #ffffff;
    --apto-3d-focus: #1d4ed8;
    --apto-3d-active-icon: #bfdbfe;
    --apto-3d-active-bg: #ffffff;
    --apto-3d-active-text: #1e3a8a;
    --apto-3d-active-edge: #bfdbfe;
    --apto-3d-spinner-track: rgba(255, 255, 255, 0.36);
    --apto-3d-success-mark: #ffffff;
  }
</style>

<button class="apto-3d-button apto-3d-button--brand" type="button">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Brand Button</span>
  </span>
</button>
```

## Release

This library is served by jsDelivr from the public GitHub repo:

```text
https://github.com/Greenocide/apto-3d-buttons
```

When files change, commit, tag a new version, and push:

```bash
git add .
git commit -m "Update Apto 3D buttons"
git tag v0.4.2
git push origin main
git push origin v0.4.2
```

Then update site URLs to the new tag:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.4.2/dist/apto-3d-buttons.css">
<script src="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.4.2/dist/apto-3d-buttons.global.js" defer></script>
```
