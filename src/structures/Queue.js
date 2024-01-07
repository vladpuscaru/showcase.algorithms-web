export class Queue {
    constructor() {
        this.elements = [];
    }

    enqueue = (element) => {
        this.elements.push(element);
    }

    dequeue = () => {
        return this.elements.shift();
    }

    isEmpty = () => {
        return this.elements.length === 0;
    }

    clear = () => {
        this.elements = [];
    }
}

