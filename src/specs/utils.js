

// Drift state uses tagName to check if it's an HTMLElement, so we can fake it like this
class HTMLElement {
    constructor() {
        this.tagName = "DIV";
    }
}

export function getEl() {
    return new HTMLElement();
}

export function tryIt(cb) {
    var success = true;
    try {
        cb();
    } catch(err) {
        // console.log("ERROR: ", err);
        success = false;
    }
    
    expect(success).toBe(true);
}
