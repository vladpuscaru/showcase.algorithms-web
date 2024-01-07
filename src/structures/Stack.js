export class Stack {
    constructor() {
        this.elements = [];
    }

    push = (element) => {
        this.elements.push(element);
    }

    pop = () => {
        return this.elements.pop();
    }

    isEmpty = () => {
        return this.elements.length === 0;
    }

    clear = () => {
        this.elements = [];
    }
}

