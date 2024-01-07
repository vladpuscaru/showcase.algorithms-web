
export class Node {
    constructor(x, y, value) {
        this.adjacents = []; // array with references to other Node objects
        this.parent    = undefined; // reference to another Node object
        this.x         = x;
        this.y         = y;
        this.value     = value;
    }
}

