"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getEl = getEl;
exports.tryIt = tryIt;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Drift state uses tagName to check if it's an HTMLElement, so we can fake it like this
var HTMLElement = function HTMLElement() {
    _classCallCheck(this, HTMLElement);

    this.tagName = "DIV";
};

function getEl() {
    return new HTMLElement();
}

function tryIt(cb) {
    var success = true;
    try {
        cb();
    } catch (err) {
        // console.log("ERROR: ", err);
        success = false;
    }

    expect(success).toBe(true);
}
//# sourceMappingURL=utils.js.map
