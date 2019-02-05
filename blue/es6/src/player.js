export class Player {
    constructor() {
        this.index = 0;
    }

    getIndex() {
        return this.index;
    }

    setIndex(index) {
        this.index = index;
        return this;
    }

    static of() {
        return new Player();
    }
 }