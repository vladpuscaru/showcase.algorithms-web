import { Graph } from "../../structures/Graph";
import { bfs } from "../../algorithms/pathfinding/bfs";
import express from "express";
import { dfs } from "../../algorithms/pathfinding/dfs";

const router = express.Router();

/**
 * @path        /algorithms/pathfinding/bfs
 * @method      POST
 * @requestBody data         - matrix of the map
 * @requestBody startIndices - the [i, j] vector representing the indices in the matrix of the starting node
 * @requestBody endIndices   - the [i, j] vector representing the indices in the matrix of the end node
 * @requestBody actions      - the allowed actions used to compute the adjacent nodes. Eg: [[1, 0], [-1, 0]]
 * @description BFS algorithm
 */
router.post('/bfs', (req, res, next) => {
    try {
        const startTimeMs = Date.now();
        console.log(`Entered /algorithms/pathfinding/bfs`, { startTimeMs });

        const { data, startIndices, endIndices, actions } = req.body;
        if (!data || !startIndices || !endIndices || !actions) {
            return res.status(400).json({ error: 'Bad Request' });
        }

        if (startIndices.length !== 2 || endIndices.length !== 2 ||
            startIndices[0] < 0 || startIndices[1] < 0 || endIndices[0] < 0 || endIndices[1] < 0) {
            return res.status(400).json({ error: 'Bad Request' });
        }

        const graph = new Graph(data, actions);
        const startNode = graph.get(startIndices);
        const endNode = graph.get(endIndices);
        const algResp = bfs(graph, startNode, endNode);

        const open   = algResp.open.map(iter => iter.map(node => [node.y, node.x]));
        const closed = algResp.closed.map(iter => iter.map(node => [node.y, node.x]));
        const path   = algResp.path.map(node => [node.y, node.x]);

        const endTimeMs = Date.now();
        console.log(`Returning from /algorithms/pathfinding/bfs`, { endTimeMs})
        return res.status(200).json({ open, closed, path, ms: endTimeMs - startTimeMs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error :(' });
    }
});

/**
 * @path        /algorithms/pathfinding/dfs
 * @method      POST
 * @requestBody data         - matrix of the map
 * @requestBody startIndices - the [i, j] vector representing the indices in the matrix of the starting node
 * @requestBody endIndices   - the [i, j] vector representing the indices in the matrix of the end node
 * @requestBody actions      - the allowed actions used to compute the adjacent nodes. Eg: [[1, 0], [-1, 0]]
 * @description BFS algorithm
 */
router.post('/dfs', (req, res, next) => {
    try {
        const startTimeMs = Date.now();
        console.log(`Entered /algorithms/pathfinding/dfs`, { startTimeMs });

        const { data, startIndices, endIndices, actions } = req.body;
        if (!data || !startIndices || !endIndices || !actions) {
            return res.status(400).json({ error: 'Bad Request' });
        }

        if (startIndices.length !== 2 || endIndices.length !== 2 ||
            startIndices[0] < 0 || startIndices[1] < 0 || endIndices[0] < 0 || endIndices[1] < 0) {
            return res.status(400).json({ error: 'Bad Request' });
        }

        const graph = new Graph(data, actions);
        const startNode = graph.get(startIndices);
        const endNode = graph.get(endIndices);
        const algResp = dfs(graph, startNode, endNode);

        const open   = algResp.open.map(node => [node.y, node.x]);
        const closed = algResp.closed.map(node => [node.y, node.x]);
        const path   = algResp.path.map(node => [node.y, node.x]);

        const endTimeMs = Date.now();
        console.log(`Returning from /algorithms/pathfinding/dfs`, { endTimeMs})
        return res.status(200).json({ open, closed, path, ms: endTimeMs - startTimeMs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error :(' });
    }
});


export { router };