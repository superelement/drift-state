"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = require("./utils.js");

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ds = require("../index.js");

// stops console from clogging up with warnings during tests
ds.testable.suppressWarnings(true);

describe("go", function () {
    var fun = ds.go,
        el = utils.getEl(),
        property = "opacity";

    it("should verify 'el' and 'property' in options", function () {
        utils.tryIt(function () {
            fun({ el: el, property: property });
        });
    });

    it("should verify 'cssState' is returned unmodified", function () {
        var STATE = "is-transitioning";
        var inst = fun({
            el: el, property: property,
            cssState: STATE
        });

        expect(inst.cssState).toBe(STATE);
    });

    it("should verify 'cssNoState' is returned unmodified", function () {
        var STATE = "no-transition";
        var inst = fun({
            el: el,
            property: property,
            cssNoState: STATE
        });

        expect(inst.cssNoState).toBe(STATE);
    });

    it("should verify 'cssState' is returned populated with default when not given", function () {
        var inst = fun({ el: el, property: property });
        expect(inst.cssState).toBe(ds.testable.getCssState());
    });

    it("should verify 'cssNoState' is returned populated with default when not given", function () {
        var inst = fun({ el: el, property: property });
        expect(inst.cssNoState).toBe(ds.testable.getCssNoState());
    });

    it("should verify that an instance has been created and given a 'uid' (unique ID)", function () {
        var inst = fun({ el: el, property: property });
        expect(inst.uid).toBeDefined();
    });
});

describe("getUID", function () {

    var fun = ds.testable.getUID,
        uid1 = fun(),
        uid2 = fun();

    it("should get a string", function () {
        expect(typeof uid1 === "undefined" ? "undefined" : _typeof(uid1)).toBe("string");
    });

    it("should not contain spaces", function () {
        expect(uid1).not.toContain(" ");
    });

    it("should get a unique value each time", function () {
        expect(uid1).not.toBe(uid2);
    });
});
//# sourceMappingURL=unit.js.map
