"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NS = "driftState";
var DEF_STATE_NAME = "adrift";
var DEF_NO_STATE_NAME = "no-drift";

var ds = {};
var isNode = !!(typeof module !== 'undefined' && module.exports);
var isBrowser = typeof window !== "undefined";
var _suppressWarnings = false;

if (isBrowser) ds = window[NS] = {};

var instances = [];

var DriftState = function () {
    function DriftState(el, property, cssState, cssNoState, stateTarget, transitionEndCB, clearCssStateWaitTime) {
        _classCallCheck(this, DriftState);

        this.el = el;
        this.stateTarget = stateTarget || el;

        this.property = property;
        if (this.property === "transform") this.property = getTransformName();

        this.cssState = cssState;
        this.cssNoState = cssNoState;
        this.uid = getUID();
        this.transitionEndCB = transitionEndCB;
        this.clearCssStateWaitTime = clearCssStateWaitTime;
    }

    _createClass(DriftState, [{
        key: "go",
        value: function go() {
            var _this = this;

            var canDrift = supportsTransitions();
            var el = this.el;

            if (canDrift) handleTransEnd(el, this.stateTarget, this.cssState, this.property, this.transitionEndCB);else this.stateTarget.classList.add(this.cssNoState);

            // check the various CSS properties to see if a duration has been set
            var cl = ["transition-duration", "-moz-transition-duration", "-webkit-transition-duration", "-o-transition-duration"];
            var duration = 0;
            cl.forEach(function (itm, idx) {
                duration || (duration = parseFloat(window.getComputedStyle(el, itm)));
            });

            if (el.to) clearTimeout(el.to);

            // if I have a duration then add the class
            if (duration !== 0) {
                if (canDrift) this.stateTarget.classList.add(this.cssState);
                el.offsetWidth; // check offsetWidth to force the style rendering

                // clears the css state after awhile, incase the css transition never happens (the CSS may be incorrectly set)
                el.to = setTimeout(function () {
                    _this.stateTarget.classList.remove(_this.cssState);
                }, this.clearCssStateWaitTime);
            };
        }
    }]);

    return DriftState;
}();

/* From Modernizr */


function whichTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    };

    var allTrans = [];

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            allTrans.push(transitions[t]);
        }
    }

    if (!allTrans.length) return null;
    return allTrans;
}

// checks if the css property was found in the event. Transform property is an object, because it can have multiple names.
function isPropertyFound(property, evt) {

    if (typeof property === "string") {
        // just triggers for one property type (if specified)
        if (property && evt.propertyName !== property) return false;
    } else if (Array.isArray(property)) {

        var found = false;
        property.forEach(function (obj) {
            if (obj.css === evt.propertyName) found = true;
        });

        if (!found) return false;
    }

    return true;
}

function handleTransEnd(el, stateTarget, cssState, property, transitionEndCB) {
    var evtFired = false;

    var transitionEventList = whichTransitionEvent();

    var fun = function fun(evt) {

        // if CSS property didn't exist in the event, ignore it
        if (!isPropertyFound(property, evt)) return;

        // stops multiple events triggering
        if (!evtFired) {
            evtFired = true;
            stateTarget.classList.remove(cssState);

            // console.log(NS, "trans end");

            transitionEventList.forEach(function (transitionEvent) {
                el.removeEventListener(transitionEvent, fun);
            });

            if (transitionEndCB) transitionEndCB(el, stateTarget, cssState, property);
        }
    };
    if (transitionEventList) {
        // console.log(NS, transitionEventList)
        transitionEventList.forEach(function (transitionEvent) {
            el.addEventListener(transitionEvent, fun, false);
        });
    }
}

// Checks if transitions are supported
function supportsTransitions() {
    var b = document.body || document.documentElement,
        s = b.style,
        p = 'transition';

    if (typeof s[p] == 'string') {
        return true;
    }

    // Tests for vendor specific prop
    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (var i = 0; i < v.length; i++) {
        if (typeof s[v[i] + p] == 'string') {
            return true;
        }
    }

    return false;
}

// gets the CSS & JS name of the 'transform' property, which can vary from browser to browser
function getTransformName() {
    var st = window.getComputedStyle(document.body, null);

    var transList = [];

    // removed 'null' check because it came in as empty string on chrome android

    if (st.getPropertyValue("transform")) {
        transList.push({
            css: "transform",
            js: "transform"
        });
    }

    if (st.getPropertyValue("-webkit-transform")) {
        transList.push({
            css: "-webkit-transform",
            js: "webkitTransform"
        });
    }

    if (st.getPropertyValue("-moz-transform")) {
        transList.push({
            css: "-moz-transform",
            js: "MozTransform"
        });
    }

    if (st.getPropertyValue("-ms-transform")) {
        transList.push({
            css: "-ms-transform",
            js: "msTransform"
        });
    }

    if (st.getPropertyValue("-o-transform")) {
        transList.push({
            css: "-o-transform",
            js: "OTransform"
        });
    }

    if (!transList.length) return null;
    return transList;
}

/**
 * @description Gets a unique string, with an optional prefix that can be useful for human readability.
 * @param pref (string) optional - A prefix string for the unique id.
 * @return (string) The unique id.
 */
function getUID(pref) {
    var uid = (pref || "") + Math.random().toString().replace(".", "");

    // ensure starts with a letter, as CSS class names should not start with a number
    var firstChar = uid.substr(0, 1);
    if (parseInt(firstChar).toString() !== "NaN") uid = "a-" + uid;

    return uid;
}

// check if given object has is an HTMLElement called 'el'
function checkEl(opts) {
    if (!opts.el) return false;
    return _typeof(opts.el.tagName).toLowerCase() !== "string";
}

function err(funName, msg, val) {
    var warn = [NS, funName];
    if (typeof val !== "undefined") warn.push(val);
    if (!_suppressWarnings) console.warn.apply(this, warn);
    throw Error([NS, funName, msg].join(", "));
}

// main initializing function. Returns opts, which may have been modified.
ds.go = function (opts) {

    _suppressWarnings = !opts.showLogs;

    // check opts are valid first
    if (!opts) err("go", "'opts' was not defined", opts);
    if (checkEl(opts)) err("go", "'opts.el' was not an HTMLElement", opts.el);
    if (opts.stateTarget && checkEl(opts)) err("go", "'opts.stateTarget' was not an HTMLElement", opts.stateTarget);
    if (typeof opts.property !== "string") err("go", "'opts.property' was not a valid string", opts.property);

    if (typeof opts.cssState !== "string") {
        opts.cssState = DEF_STATE_NAME;
        if (!_suppressWarnings) console.log(NS, "go", "No 'opts.cssState' given, so defaulting to " + DEF_STATE_NAME + ".");
    }

    if (typeof opts.cssNoState !== "string") {
        opts.cssNoState = DEF_NO_STATE_NAME;
        if (!_suppressWarnings) console.log(NS, "go", "No 'opts.cssNoState' given, so defaulting to " + DEF_NO_STATE_NAME + ".");
    }

    if (!opts.clearCssStateWaitTime) opts.clearCssStateWaitTime = 5000;

    var inst = new DriftState(opts.el, opts.property, opts.cssState, opts.cssNoState, opts.stateTarget, opts.transitionEndCB, opts.clearCssStateWaitTime);
    instances.push(inst);

    if (isBrowser) inst.go();

    return inst;
};

ds.testable = {
    suppressWarnings: function suppressWarnings(val) {
        _suppressWarnings = val;
    },
    getCssState: function getCssState() {
        return DEF_STATE_NAME;
    },
    getCssNoState: function getCssNoState() {
        return DEF_NO_STATE_NAME;
    },
    getUID: getUID

    // make available in Common.js
};if (isNode) module.exports = ds;
//# sourceMappingURL=index.js.map
