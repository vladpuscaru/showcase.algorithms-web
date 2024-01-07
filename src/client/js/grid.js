class Grid {
    constructor(data) {
        this.data = [];
        this.originalData = [];
        for (let i = 0; i < data.length; i++) {
            this.data.push([]);
            this.originalData.push([]);
            for (let j = 0; j < data[i].length; j++) {
                this.data[i].push(data[i][j]);
                this.originalData[i].push(data[i][j]);
            }
        }

        this.canvas = document.getElementById("canvas");
        this.cbToggleGrid = document.getElementById("toggle-grid");

        this.mousePos = [-1, -1];
        this.sourceCell = [-1, -1, -1]; // [x, y, value]
        this.destCell = [-1, -1, -1]; // [x, y, value]

        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.getBoundingClientRect().width;
        this.height = this.canvas.getBoundingClientRect().height;

        this.animations = [];
        this.updateQueue = [];

        this.setupEventListeners();
    }

    render = () => {
        const cellWidth = Math.floor(this.width / this.data.length);
        const cellHeight = Math.floor(this.height / this.data[0].length);

        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                this.ctx.fillStyle = CELL_TYPES[this.data[i][j]];
                this.ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);

                if (this.cbToggleGrid.checked) {
                    this.ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                }
            }
        }

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '18px Arial';
        this.ctx.fillText(`(${this.mousePos[0]}, ${this.mousePos[1]})`, 5, this.height);
    }

    update = (indices, value) => {
        for (let i = 0; i < indices.length; i++) {
            this.data[indices[i][0]][indices[i][1]] = value;
        }
    }

    updateAfterAnimations = (indices, value) => {
        this.updateQueue.push({ indices, value });
    }

    animate = (indices, value, speed) => {
        let counter = 0;
        const anim = setInterval(() => {
            for (let k = 0; k < speed; k++) {
                const i = indices[counter][0];
                const j = indices[counter][1];
                this.data[i][j] = value;

                if (counter < indices.length - 1) {
                    counter++;
                }
            }
            this.render();

            if (counter >= indices.length - 1) {
                clearInterval(anim);
                const index = this.animations.findIndex(x => x === anim);
                this.animations.splice(index, 1);
                this.checkUpdateQueue();
            }
        }, 5);

        this.animations.push(anim);
    }

    animateBatches = (iterations, value, speed) => {
        let iterCounter = 0;
        const anim = setInterval(() => {
            for (let m = 0; m < speed; m++) {
                const iteration = iterations[iterCounter];
                for (let k = 0; k < iteration.length; k++) {
                    const i = iteration[k][0];
                    const j = iteration[k][1];
                    this.data[i][j] = value;
                }
                if (iterCounter < iterations.length - 1) {
                    iterCounter++;
                } else {
                    break;
                }
            }
            this.render();

            console.log(iterCounter);

            if (iterCounter >= iterations.length - 1) {
                clearInterval(anim);
                const index = this.animations.findIndex(x => x === anim);
                this.animations.splice(index, 1);
                this.checkUpdateQueue();
            }
        }, 5);

        this.animations.push(anim);
    }

    clearCanvas = () => {
        for (let i = 0; i < this.animations.length; i++) {
            clearInterval(this.animations[i]);
        }
        this.animations = [];

        this.sourceCell = [-1, -1, -1];
        this.destCell = [-1, -1, -1];

        this.updateQueue = [];

        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                this.data[i][j] = this.originalData[i][j];
            }
        }

        this.render();
    }

    checkUpdateQueue = () => {
        if (this.animations.length === 0) {
            for (let x = 0; x < this.updateQueue.length; x++) {
                this.update(this.updateQueue[x].indices, this.updateQueue[x].value);
                this.render();
            }
        }
    }

    setupEventListeners = () => {
        this.cbToggleGrid.addEventListener('change', () => {
            this.render();
        });

        this.canvas.addEventListener('mousemove', (event) => {
            this.mousePos = this.worldCoordsToGridCoords([event.clientX, event.clientY]);
            // this.render();
        });

        /**
         * Set source cell
         */
        this.canvas.addEventListener('click', (event) => {
            event.preventDefault();
            if (this.sourceCell[0] !== -1) {
                const oldX = this.sourceCell[0];
                const oldY = this.sourceCell[1];
                const oldV = this.sourceCell[2];
                this.data[oldY][oldX] = oldV;
            }

            const x = this.mousePos[0];
            const y = this.mousePos[1];

            this.sourceCell = [x, y, this.data[y][x]];
            this.data[y][x] = CELL_TYPE_SOURCE;
            this.render();
        });

        /**
         * Set destination cell
         */
        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (this.destCell[0] !== -1) {
                const oldX = this.destCell[0];
                const oldY = this.destCell[1];
                const oldV = this.destCell[2];
                this.data[oldY][oldX] = oldV;
            }

            const x = this.mousePos[0];
            const y = this.mousePos[1];

            this.destCell = [x, y, this.data[y][x]];
            this.data[y][x] = CELL_TYPE_DESTINATION;
            this.render();
        });
    }

    changeMap = (data) => {
        this.originalData = [];
        for (let i = 0; i < data.length; i++) {
            this.originalData.push([]);
            for (let j = 0; j < data[i].length; j++) {
                this.originalData[i].push(data[i][j]);
            }
        }

        this.clearCanvas();
    }

    /**
     * Converts from position in pixels to position on the grid
     * @param worldCoords the [x, y] vector representing the position in pixels
     */
    worldCoordsToGridCoords = (worldCoords) => {
        const mouseX = worldCoords[0] - this.canvas.offsetLeft;
        const mouseY = worldCoords[1] - this.canvas.offsetTop;
        const cellWidth = Math.floor(this.width / this.data.length);
        const cellHeight = Math.floor(this.height / this.data[0].length);

        const x = Math.floor(mouseX / cellWidth);
        const y = Math.floor(mouseY / cellHeight);

        return [x, y];
    }
}