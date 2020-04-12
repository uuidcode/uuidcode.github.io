class Cell {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.name = '';
    }

    setWidth(width) {
        this.width = width;
        return this;
    }

    getWith() {
        return this.width;
    }

    setHeight(height) {
        this.height = height;
        return this;
    }

    getHeight() {
        return this.height;
    }

    setX(x) {
        this.x = x;
        return this;
    }

    getX() {
        return this.x;
    }

    setY(y) {
        this.y = y;
        return this;
    }

    getY() {
        return this.y;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    getName() {
        return this.name;
    }
}