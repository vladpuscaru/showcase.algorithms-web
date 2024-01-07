import { Node } from "./Node";

export class Graph {
    constructor(matrix, actions) {
        this.nodes = []; // Matrix with nodes

        // Create nodes
        for (let i = 0; i < matrix.length; i++) {
            const row = [];
            for (let j = 0; j < matrix[i].length; j++) {
                row.push(new Node(j, i, matrix[i][j]));
            }
            this.nodes.push(row);
        }

        // Create edges
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j < this.nodes[i].length; j++) {
                for (let k = 0; k < actions.length; k++) {
                    const adjX = j + actions[k][0];
                    const adjY = i + actions[k][1];
                    const adj = this.nodes[adjY] ? this.nodes[adjY][adjX] : undefined;
                    if (adj && adj.value === this.nodes[i][j].value) {
                        this.nodes[i][j].adjacents.push(adj);
                    }
                }
            }
        }
    }

    get = ([i, j]) => {
        return this.nodes[i] ? this.nodes[i][j] : undefined;
    }
}

