# Drift State

A small JS helper to give your CSS transitions a transitioning (aka drifting) state, with no additional library dependencies (like jQuery).

## Work in progress
This project works, but is still in early stages of development, so use with caution.

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
- `clearCssStateWaitTime`: {number} (optional): The amount of milliseconds to wait until clearing wrongly configured CSS states. Defaults to 5000 (5 seconds).
- `showLogs`: {boolean} (optional): If true, will show all logs in the console. This is false by default.
- `transitionEndCB`: {function} (optional): Optionally include a function to call when the transition is complete.

## Notes
Inspired by jQuery plugin 'prepareTransition' https://github.com/snookca/prepareTransition
Using ES6 or TypeScript
```
import * as ds from 'drift-state';
```

## Examples

## Simple example
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

## Example with parent state
This example can be run by opening `src/example/example-parent-state.html` in the browser. Shows a parent state affecting the box position and colour.

Example CSS
```css
.box {
    float:left;
    width: 100px;
    height: 100px;
    background-color: #ababab;
    opacity: 1;

    transition: 0.5s linear;
    transition-property: opacity, transform;
    transform-origin: top center;
    
    transform: translateY(0%);
    display: block;
    
}

.is-down .box {
    transform: translateY(100px);
    background-color: red;
}

.is-gone .box {
    opacity: 0;
    display: none;
}
.box.adrift {
    display: block !important;
    background-color: #ababab;
}
.btn {
    float:left;
    clear:left;
}
```

Example JS
```js
var box = document.querySelector(".box")
  , container = document.querySelector(".container")
  , btn1 = document.querySelector(".btn1")
  , btn2 = document.querySelector(".btn2");

btn1.addEventListener("click", function(evt) {
    window.driftState.go({
        el: box, property: "opacity"
    });
    container.classList.toggle("is-gone");
});

btn2.addEventListener("click", function(evt) {
    window.driftState.go({
        el: box, property: "transform"
    });
    container.classList.toggle("is-down");
});
```