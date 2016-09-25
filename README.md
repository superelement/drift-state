# Drift State

A small JS helper to give your CSS transitions a transitioning (aka drifting) state, with no additional library dependencies (like jQuery).

## Polyfills
The library uses the following features, which you'll need to polyfill if not supported:
- classList
- Array.forEach
- Array.isArray
- querySelector/querySelectorAll
- addEventListener/removeEventListener

## Options
- `el` {HTMLElement}: The HTML element that you are transitioning.
- `property` {string}: The CSS property that you are transitioning.
- `cssState`: {string} (optional): The CSS state name (defaults to `adrift`).
- `cssNoState`: {string} (optional): The blocking CSS state name, which gets added by browsers that don't support CSS transitions (defaults to `no-drift`).
- `stateTarget`: {HTMLElement} (optional): An element that you want to attach the CSS states to, if not using `el`. Defaults to using `el`.

## Notes
Inspired by jQuery plugin 'prepareTransition' https://github.com/snookca/prepareTransition

## Examples
A simple example can be run by opening `src/example/example.html` in the browser. Shows a fade out that adds a `display:none` when finished.

Example CSS
```css
.box {
    float:left;
    width: 100px;
    height: 100px;
    background-color: #ababab;
    opacity: 1;
    transition: opacity 1s linear;
}
.box.is-gone {
    opacity: 0;
    display: none;
}
.box.adrift {
    display: block !important;
}
.btn {
    float:left;
    clear:left;
}
```

Example JS
```js
var box = document.querySelector(".box")
    , btn = document.querySelector(".btn");

btn.addEventListener("click", function(evt) {
    window.driftState.go({
        el: box, property: "opacity"
    });
    box.classList.toggle("is-gone");
});
```

## TODO:
- Add an optional callback
- e2e tests