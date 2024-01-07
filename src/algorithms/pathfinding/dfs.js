import { Stack } from "../../structures/Stack";

/**
 * Depth-First-Search pathfinding algorithm
 * @param graph - The Graph structure
 * @param start - The reference to the start node
 * @param end   - The reference to the end node
 *
 * @returns the tuple of [open, closed, path]
 * @return open   - array with opened nodes in the order of opening
 * @return closed - array with closed nodes in the order of closing
 * @return path   - array of nodes that represent the path from source to destination
 */
export const dfs = (graph, start, end) => {
    const open   = new Stack();
    const openR  = [];
    const closed = new Map();
    const path   = [];

    open.push(start);
    closed.set(start, true);

    let finished = false;
    while (!finished && !open.isEmpty()) {
        const node = open.pop();

        if (node === end) {
            finished = true;
            continue;
        }

        node.adjacents.forEach(adj => {
            if (!closed.get(adj)) {
                closed.set(adj, true);
                open.push(adj);
                openR.push(adj);
                adj.parent = node;
            }
        });
    }

    // Compute path if exists
    if (finished) {
        let currentNode = end;

        while (currentNode) {
            path.push(currentNode);
            currentNode = currentNode.parent;
        }
    }

    return { open: openR, closed: Array.from(closed.keys()), path };
}