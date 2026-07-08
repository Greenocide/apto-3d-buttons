# Apto 3D Buttons

Reusable, shadow-free push buttons for static sites and app frontends. The CSS follows the classic `pushable` plus raised `front` pattern; the small JavaScript module is only for optional toggle, loading, and success states.

## Files

- `src/apto-3d-buttons.css` - source button styles and variants.
- `src/apto-3d-buttons.js` - optional state helpers.
- `dist/apto-3d-buttons.css` - CDN/plain-browser CSS build.
- `dist/apto-3d-buttons.global.js` - browser/WordPress-friendly script.
- `buttons.html` - local gallery/demo.
- `examples/cdn-usage.html` - CDN/static-host usage example.

## Quick Use

Add the CSS to your page:

```html
<link rel="stylesheet" href="/path/to/dist/apto-3d-buttons.css">
```

Use the required nested markup. `.apto-3d-button` is the pushable back layer; `.apto-3d-button__content` is the raised front layer.

```html
<button class="apto-3d-button" type="button">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Push me</span>
  </span>
</button>
```

For optional JS helpers:

```html
<script type="module">
  import { completeButtonWithSuccess, initApto3DButtons } from '/path/to/apto-3d-buttons.js';

  initApto3DButtons();

  document.querySelector('#submitBtn').addEventListener('click', (event) => {
    completeButtonWithSuccess(event.currentTarget);
  });
</script>
```

## Use As A Private Package

After this folder is pushed to a private GitHub repo, install it in another project:

```bash
npm install git+ssh://git@github.com:YOUR_USER/apto-3d-buttons.git
```

Import the CSS in your app entry:

```js
import 'apto-3d-buttons/css';
```

Import optional helpers from the package root:

```js
import { completeButtonWithSuccess, initApto3DButtons } from 'apto-3d-buttons';
```

For plain HTML sites, copy `src/apto-3d-buttons.css` and `src/apto-3d-buttons.js` into your assets folder and link them directly.

For plain HTML, WordPress Custom HTML blocks, Webflow embeds, Shopify theme snippets, etc., use the global script instead of the ES module:

```html
<link rel="stylesheet" href="/assets/apto-3d-buttons/apto-3d-buttons.css">
<script src="/assets/apto-3d-buttons/apto-3d-buttons.global.js" defer></script>
```

## CDN-Style Use

This repo is designed to be used from a public GitHub repo through jsDelivr.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.1.0/dist/apto-3d-buttons.css">
<script src="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.1.0/dist/apto-3d-buttons.global.js" defer></script>
```

Use a version tag such as `v0.1.0` in production so site builds do not change unexpectedly. During quick testing, you can point at `main`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@main/dist/apto-3d-buttons.css">
<script src="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@main/dist/apto-3d-buttons.global.js" defer></script>
```

Private GitHub repos do not work as public CDN files for normal site visitors. The repo must be public for jsDelivr to serve it to websites.

### cdnjs

cdnjs is curated, not a general file uploader and not the same thing as jsDelivr. To get listed there, the library needs to be public/open-source and accepted into the cdnjs package registry. The normal flow is:

1. Publish the library publicly on npm or GitHub.
2. Make sure releases include the files in `dist/`.
3. Add a library package config in the `cdnjs/packages` repo.
4. Open a pull request and wait for review/acceptance.

For day-to-day use on WordPress or client sites, jsDelivr is simpler because the URLs work as soon as the public GitHub repo and tag exist.

## WordPress

Add the CDN/static-host tags to your site header/footer, then paste button markup into a Custom HTML block:

```html
<button class="apto-3d-button apto-3d-button--violet" type="button">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Book now</span>
  </span>
</button>
```

For a WordPress loading demo button, add `data-apto-complete`. The global script auto-initializes this on page load:

```html
<button class="apto-3d-button apto-3d-button--green" type="button" data-apto-complete data-apto-loading-ms="900" data-apto-success-ms="900">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Submit</span>
  </span>
</button>
```

For real form submissions, do not use `data-apto-complete`; call the helper from your form script after your AJAX request succeeds:

```js
window.Apto3DButtons.completeButtonWithSuccess(button);
```

Icon-only submit buttons use the same helper:

```html
<button class="apto-3d-button apto-3d-button--icon apto-3d-button--primary" type="button" id="iconSubmitBtn" aria-label="Submit">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">
      <svg class="apto-3d-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">...</svg>
    </span>
  </span>
</button>

<script type="module">
  import { completeButtonWithSuccess } from '/path/to/apto-3d-buttons.js';

  document.querySelector('#iconSubmitBtn').addEventListener('click', (event) => {
    completeButtonWithSuccess(event.currentTarget);
  });
</script>
```

## Variants

Color classes:

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

Size/layout classes:

- `apto-3d-button--sm`
- `apto-3d-button--lg`
- `apto-3d-button--icon`

State classes:

- `is-active`
- `is-loading`
- `is-success`

Toggle buttons can use `data-apto-toggle`; `initApto3DButtons()` will toggle `is-active` and update `aria-pressed`.

```html
<button class="apto-3d-button apto-3d-button--icon apto-3d-button--like" type="button" aria-label="Like" aria-pressed="false" data-apto-toggle>
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">...</span>
  </span>
</button>
```

## Custom Colors

Override the CSS variables on any button or wrapper:

```html
<button
  class="apto-3d-button"
  style="
    --apto-3d-bg: #111827;
    --apto-3d-bg-hover: #1f2937;
    --apto-3d-edge: #4b5563;
    --apto-3d-text: #ffffff;
  "
  type="button"
>
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Custom</span>
  </span>
</button>
```

You can also create project presets:

```css
.apto-3d-button--brand {
  --apto-3d-bg: #2563eb;
  --apto-3d-bg-hover: var(--apto-3d-bg);
  --apto-3d-edge: #1e3a8a;
  --apto-3d-text: #ffffff;
  --apto-3d-focus: #1d4ed8;
  --apto-3d-spinner-track: rgba(255, 255, 255, 0.36);
  --apto-3d-success-mark: #ffffff;
}
```

Then compose it like any built-in preset:

```html
<button class="apto-3d-button apto-3d-button--brand apto-3d-button--lg" type="button">
  <span class="apto-3d-button__content">
    <span class="apto-3d-button__text">Continue</span>
  </span>
</button>
```

Useful variables:

- `--apto-3d-bg`
- `--apto-3d-bg-hover`
- `--apto-3d-edge`
- `--apto-3d-text`
- `--apto-3d-focus`
- `--apto-3d-spinner-track`
- `--apto-3d-spinner-size`
- `--apto-3d-spinner-stroke`
- `--apto-3d-success-mark`
- `--apto-3d-success-width`
- `--apto-3d-success-height`
- `--apto-3d-success-stroke`
- `--apto-3d-padding`
- `--apto-3d-radius`
- `--apto-3d-lift`
- `--apto-3d-pressed-edge`
- `--apto-3d-font-size`

## Public GitHub Repo

Suggested setup:

```powershell
git init
git add .
git commit -m "Create reusable Apto 3D button library"
gh repo create apto-3d-buttons --public --source=. --remote=origin --push
git tag v0.1.0
git push origin v0.1.0
```

After the tag is pushed, use:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.1.0/dist/apto-3d-buttons.css">
<script src="https://cdn.jsdelivr.net/gh/Greenocide/apto-3d-buttons@v0.1.0/dist/apto-3d-buttons.global.js" defer></script>
```
