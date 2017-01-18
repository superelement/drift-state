const NS = "driftState";
const DEF_STATE_NAME = "adrift";
const DEF_NO_STATE_NAME = "no-drift";

var ds = {};
var isBrowser = typeof window !== "undefined";
if(isBrowser) ds = window[NS] = {};

var suppressWarnings = false;

var instances = [];

class DriftState {

    constructor(el, property, cssState, cssNoState, stateTarget) {

        this.el = el;
        this.stateTarget = stateTarget || el;
        
        this.property = property;
        if(this.property === "transform") this.property = getTransformName().css;

        //if(isBrowser) console.log("getTransformName", getTransformName());
        
        this.cssState = cssState;
        this.cssNoState = cssNoState;
        this.uid = getUID();
    }

    go() {
        var canDrift = supportsTransitions();
        var el = this.el;

        if( canDrift )  hanldeTransEnd(el, this.stateTarget, this.cssState, this.property)
        else            this.stateTarget.classList.add(this.cssNoState);

        // check the various CSS properties to see if a duration has been set
        var cl = ["transition-duration", "-moz-transition-duration", "-webkit-transition-duration", "-o-transition-duration"];
        var duration = 0;
        cl.forEach((itm, idx) => {
            duration || (duration = parseFloat( window.getComputedStyle(el, itm) ));
        });

        // Should really add delay here as well, right?

        // if I have a duration then add the class
        if (duration !== 0) {
            if( canDrift ) this.stateTarget.classList.add(this.cssState);
            el.offsetWidth; // check offsetWidth to force the style rendering
        };
    }
}


/* From Modernizr */
function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

function hanldeTransEnd(el, stateTarget, cssState, property) {
    var evtFired = false;


    var transitionEvent = whichTransitionEvent();

    var fun = function(evt){

        console.log("evt.propertyName", evt.propertyName)

        // just triggers for one property type (if specified)
        if( property && evt.propertyName !== property ) return;

        // stops multiple events triggering
        if(!evtFired) {
            evtFired = true;
            stateTarget.classList.remove(cssState);

            // console.log(NS, "trans end");

            el.removeEventListener(transitionEvent, fun);
        }
    }
    transitionEvent && el.addEventListener(transitionEvent, fun, false);
}


// Checks if transitions are supported
function supportsTransitions() {
    var b = document.body || document.documentElement,
        s = b.style,
        p = 'transition';

    if (typeof s[p] == 'string') { return true; }

    // Tests for vendor specific prop
    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    p = p.charAt(0).toUpperCase() + p.substr(1);

    for (var i=0; i<v.length; i++) {
        if (typeof s[v[i] + p] == 'string') { return true; }
    }

    return false;
}

// gets the CSS & JS name of the 'transform' property, which can vary from browser to browser
function getTransformName() {
    var st = window.getComputedStyle(document.body, null);

    var rtnObj = {
        css: null, js: null
    }
    
    if( st.getPropertyValue("transform") !== null ) {
        rtnObj.css = "transform";
        rtnObj.js = "transform";
        return rtnObj;
    }

    if( st.getPropertyValue("-webkit-transform") !== null ) {
        rtnObj.css = "-webkit-transform";
        rtnObj.js = "webkitTransform";
        return rtnObj;
    }

    if( st.getPropertyValue("-moz-transform") !== null )    {
        rtnObj.css = "-moz-transform";
        rtnObj.js = "MozTransform";
        return rtnObj;
    }
    
    if( st.getPropertyValue("-ms-transform") !== null ) {
        rtnObj.css = "-ms-transform";
        rtnObj.js = "msTransform";
        return rtnObj;
    }
    
    if( st.getPropertyValue("-o-transform") !== null ) {
        rtnObj.css = "-o-transform";
        rtnObj.js = "OTransform";
        return rtnObj;
    }
    
    return null;
}


/**
 * @description Gets a unique string, with an optional prefix that can be useful for human readability.
 * @param pref (string) optional - A prefix string for the unique id.
 * @return (string) The unique id.
 */
function getUID(pref) {
    var uid = (pref || "") + Math.random().toString().replace(".", "");

    // ensure starts with a letter, as CSS class names should not start with a number
    var firstChar = uid.substr(0,1);
    if( parseInt(firstChar).toString() !== "NaN" ) uid = "a-"+uid;

    return uid;
}

// check if given object has is an HTMLElement called 'el'
function checkEl(opts) {
    if(!opts.el) return false;
    return (typeof opts.el.tagName).toLowerCase() !== "string";
}

function err(funName, msg, val) {
    var warn = [NS, funName];
    if(typeof val !== "undefined") warn.push(val);
    if(!suppressWarnings) console.warn.apply(this, warn);
    throw Error([NS, funName, msg].join(", "));
}


// main initializing function. Returns opts, which may have been modified.
ds.go = function(opts) {
    
    // check opts are valid first
    if(!opts) err("go", "'opts' was not defined", opts);
    if(checkEl(opts)) err("go", "'opts.el' was not an HTMLElement", opts.el);
    if(opts.stateTarget && checkEl(opts)) err("go", "'opts.stateTarget' was not an HTMLElement", opts.stateTarget);
    if(typeof opts.property !== "string") err("go", "'opts.property' was not a valid string", opts.property);
    
    if(typeof opts.cssState !== "string") {
        opts.cssState = DEF_STATE_NAME;
        if(!suppressWarnings)
            console.log(NS, "go", "No 'opts.cssState' given, so defaulting to " + DEF_STATE_NAME + ".");
    }
    
    if(typeof opts.cssNoState !== "string") {
        opts.cssNoState = DEF_NO_STATE_NAME;
        if(!suppressWarnings)
            console.log(NS, "go", "No 'opts.cssNoState' given, so defaulting to " + DEF_NO_STATE_NAME + ".");
    }

    var inst = new DriftState(opts.el, opts.property, opts.cssState, opts.cssNoState, opts.stateTarget);
    instances.push(inst);

    if(isBrowser) inst.go();

    return inst;
}

ds.testable = {
    suppressWarnings: function(val) {
        suppressWarnings = val;
    },
    getCssState: function() {
        return DEF_STATE_NAME;
    },
    getCssNoState: function() {
        return DEF_NO_STATE_NAME;
    },
    getUID: getUID
}

// make available in Common.js
if(!isBrowser) module.exports = ds; 