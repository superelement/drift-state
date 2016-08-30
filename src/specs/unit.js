import * as utils from "./utils.js";
var ds = require("../index.js");

// stops console from clogging up with warnings during tests
ds.testable.suppressWarnings(true);

describe("go", () => {
    var fun = ds.go
      , el = utils.getEl()
      , property = "opacity"

    it("should verify 'el' and 'property' in options", () => {
        utils.tryIt(() => {
            fun({ el, property });
        });
    });

    it("should verify 'cssState' is returned unmodified", () => {
        const STATE = "is-transitioning";
        var inst = fun({
            el, property,
            cssState: STATE
        });

        expect(inst.cssState).toBe(STATE);
    });

    it("should verify 'cssNoState' is returned unmodified", () => {
        const STATE = "no-transition";
        var inst = fun({
            el, 
            property, 
            cssNoState: STATE
        });

        expect(inst.cssNoState).toBe(STATE);
    });

    it("should verify 'cssState' is returned populated with default when not given", () => {
        var inst = fun({ el, property });
        expect(inst.cssState).toBe(ds.testable.getCssState());
    });

    it("should verify 'cssNoState' is returned populated with default when not given", () => {
        var inst = fun({ el, property });
        expect(inst.cssNoState).toBe(ds.testable.getCssNoState());
    });

    
    it("should verify that an instance has been created and given a 'uid' (unique ID)", () => {
        var inst = fun({ el, property });
        expect(inst.uid).toBeDefined();
    });
});


describe("getUID", function() {
	
	var fun = ds.testable.getUID
	  , uid1 = fun()
	  , uid2 = fun();

	it("should get a string", () => {
		expect(typeof uid1).toBe("string");
	});

	it("should not contain spaces", () => {
		expect(uid1).not.toContain(" ");
	});

	it("should get a unique value each time", () => {
		expect(uid1).not.toBe(uid2);
	});
});
