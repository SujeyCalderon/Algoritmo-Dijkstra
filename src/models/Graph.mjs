import LinkedList from "./LinkedList.mjs";
import Node from "./Node.mjs";

export default class Graph {
    
    #matrizAdyacencia = []; // Matriz de adyacencia usando listas enlazadas para almacenar los vecinos
    #map = new Map(); // Mapa para asociar vértices con índices en la matriz de adyacencia

    constructor() {}

    addVertex(vertex) {
        if (!this.#map.has(vertex)) {
            this.#matrizAdyacencia.push(new LinkedList());
            this.#map.set(vertex, this.#matrizAdyacencia.length - 1);
            return true;
        }
        return false;
    }

    addEdge(node1, node2, weight = 1) {
        if (this.#map.has(node1) && this.#map.has(node2)) {
            this.#matrizAdyacencia[this.#map.get(node1)].push(node2, weight);
            return true;
        }
        return false;
    }

    dijkstra(startVertex, endVertex) {
        const infinit = 1000000000000000000000;//distancia infinita
        const W = this.#matrizAdyacencia; 
        const numVertices = this.numVertices(); // Número de vértices en el grafo
        const D = Array(numVertices).fill(infinit); // Distancias inicializando con infinito
        const previous = {}; // Vértice previo en el camino min
        const L = new Set(); // Vértices visitados
        const LPrime = new Set(this.#map.keys()); // Vértices no visitados
        const startIndex = this.#map.get(startVertex);// Índice del vértice inicial
        D[startIndex] = 0;
    
        while (L.size < numVertices) {
            // Encuentra el vértice en LPrime con la distancia mínima en D
            let minVertex = null;
            let minDist = infinit;
            for (let vertex of LPrime) {
                const vertexIndex = this.#map.get(vertex);
                if (D[vertexIndex] < minDist) {
                    minDist = D[vertexIndex];
                    minVertex = vertex;
                }
            }
    
            if (minVertex === null) {
                break; // No hay un vértice 
            }
    
            // Agrega el vértice mínimo a L y lo elimina de LPrime
            L.add(minVertex);
            LPrime.delete(minVertex);
    
            // Obtiene el índice del vértice actual
            const u = this.#map.get(minVertex);
    
            // Recorre los vecinos del vértice actual
            const neighbors = W[u]; // Obtenemos los vecinos 
            let current = neighbors.head;
            while (current) {
                const v = this.#map.get(current.value.node);
                const weight = current.value.weight;
                // Actualiza la distancia al vecino si se encuentra un camino más corto
                if (D[u] + weight < D[v]) {
                    D[v] = D[u] + weight;
                    previous[current.value.node] = minVertex;
                }
                current = current.next;//avanza al siguiente vecino
            }
        }
    
        // Reconstruir el camino más corto si se especifica un vértice final
        if (endVertex) {
            const endIndex = this.#map.get(endVertex);
            if (D[endIndex] === infinit) {
                return { path: [], distance: infinit };
            }
            const path = [];// Inicializa un array para almacenar el camino desde el vértice inicial al vértice final
            let step = endVertex;// Comienza desde el vértice final
            while (step) {// Recorre hacia atrás desde el vértice final al inicial usando el mapa 'previous'
                path.push(step);
                step = previous[step];
            }
            return { path: path.reverse(), distance: D[endIndex] };
        }
    
        return { distances: D, previous: previous };
    }    
    
    dfs(startVertex, callback) {
        if (!this.#map.has(startVertex)) {
            return;
        }

        const visited = {};
        const stack = [];
        stack.push(startVertex);

        while (stack.length > 0) {
            const currentVertex = stack.pop(); // Saca el ultimo vertice agregado
            if (!visited[currentVertex]) { // Si no ha sido visitado
                callback(currentVertex);
                visited[currentVertex] = true;
                const neighborsLinkedList = this.#matrizAdyacencia[this.#map.get(currentVertex)];
                let current = neighborsLinkedList.head;
                while (current) {
                    const neighborVertex = current.value.node; // Obtiene el vecino
                    if (!visited[neighborVertex]) {
                        stack.push(neighborVertex); // Agrega el vecino a la pila si no ha sido visitado
                    }
                    current = current.next; // Pasa al siguiente vecino
                }
            }
        }
    }

    bfs(startVertex, callback) {
        if (!this.#map.has(startVertex)) {
            return;
        }

        const visited = {};
        const queue = [];
        queue.push(startVertex);

        while (queue.length > 0) {
            const currentVertex = queue.shift();
            if (!visited[currentVertex]) {
                callback(currentVertex);
                visited[currentVertex] = true;
                const neighborsLinkedList = this.#matrizAdyacencia[this.#map.get(currentVertex)];
                let current = neighborsLinkedList.head;
                while (current) {
                    const neighborVertex = current.value.node; 
                    if (!visited[neighborVertex]) {
                        queue.push(neighborVertex);
                    }
                    current = current.next;
                }
            }
        }
    }

    getVertices() {
        return Array.from(this.#map.keys());
    }


    numVertices() {
        return this.#map.size;
    }

    numEdges() {
        let numEdges = 0;
        for (let linkedList of this.#matrizAdyacencia) {
            numEdges += linkedList.size();
        }
        return numEdges;
    }
}