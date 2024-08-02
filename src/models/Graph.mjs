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

    dijkstra(startVertex) {
        const inf = 1000000;
        const numVertices = this.numVertices();
        let D = new Array(numVertices).fill(inf); //distancias mínimas desde el vértice de inicio
        let lPrima = new Set([...this.#map.values()]); //vértices no procesados
        let L = new Set(); // vertices procesados
    
        const start = this.#map.get(startVertex);
        if (start === undefined) {
            return null; // El vértice de inicio no está en el grafo
        }
    
        D[start] = 0;
    
        while (lPrima.size > 0) {
            let u = null;
            let minDistance = inf;
            // Encuentra el vértice con la distancia mínima entre los no procesados
            for (let vertex of lPrima) {
                if (D[vertex] < minDistance) {
                    minDistance = D[vertex];
                    u = vertex;
                }
            }
            // Si no se encuentra un vértice valido, se sale del bucle
            if (u === null) {
                break;
            }
    
            L.add(u);
            lPrima.delete(u);
    
            const neighborsLinkedList = this.#matrizAdyacencia[u];
            let current = neighborsLinkedList.head;
            // Actualiza las distancias para los vecinos del vértice u
            while (current) {
                const neighbor = this.#map.get(current.value.node);
                const weight = current.value.weight;
                // Si el vecino está en lPrima y se encuentra una distancia más corta, se actualiza D
                if (lPrima.has(neighbor) && D[u] + weight < D[neighbor]) {
                    D[neighbor] = D[u] + weight;
                }
                current = current.next;
            }
        }
    
        // Crear un objeto para devolver los resultados de las distancias
        const distances = {};
        for (let [vertex, index] of this.#map) {
            distances[vertex] = D[index];
        }
    
        return distances;
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
        return this.#map.keys();
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