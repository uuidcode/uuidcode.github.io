export class Flag {
    constructor() {
        this.code = null;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
        return this;
    }

    static of() {
        return new Flag();
    }
}