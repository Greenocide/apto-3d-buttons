# Apto 3D Buttons

Reusable push buttons loaded from jsDelivr. Include both files on every site: the CSS draws the buttons, and the JS initializes loading/toggle helpers.

## Install

Paste these two tags in your page, WordPress header/footer, Custom HTML area, or site builder embed:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.1.2/dist/apto-3d-buttons.css">
<script src="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.1.2/dist/apto-3d-buttons.global.js" defer></script>
```

Use the version tag URL in production. For quick testing, you can use `@main`, but tagged versions are safer.

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

Icon buttons contain `svg`, `i`, and `img` elements automatically. For SVG active-color swapping, build the icon with `currentColor`.

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
      <i aria-hidden="true">★</i>
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

## Switch

Use `apto-3d-button--switch` with `data-apto-toggle`:

```html
<button class="apto-3d-button apto-3d-button--switch" type="button" aria-label="Enable setting" aria-pressed="false" data-apto-toggle>
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Enable setting</span>
  </span>
</button>
```

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

```html
<button class="apto-3d-button apto-3d-button--icon apto-3d-button--like" type="button" aria-label="Like" aria-pressed="false" data-apto-toggle>
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">
      <svg class="apto-3d-icon heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M12 21s-7.2-4.35-9.7-9C.8 8 2.3 4 6 4c2 0 4 1.5 6 4 2-2.5 4-4 6-4 3.7 0 5.2 4 3.7 8-2.5 4.65-9.7 9-9.7 9z"></path>
      </svg>
    </span>
  </span>
</button>
```

Active icon buttons keep the same button colors and only change the icon color with `--apto-3d-active-icon`. SVG icons should use `currentColor` for `fill` or `stroke` when you want the active color to apply.

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
git tag v0.1.3
git push origin main
git push origin v0.1.3
```

Then update site URLs to the new tag:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.1.3/dist/apto-3d-buttons.css">
<script src="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.1.3/dist/apto-3d-buttons.global.js" defer></script>
```
