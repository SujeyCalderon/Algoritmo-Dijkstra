import Graph from "../models/Graph.mjs";

const graph = new Graph();

const btnAgregarDestino = document.getElementById("agregarDestinoBtn");
const btnAgregarConexion = document.getElementById("agregarRutaBtn");
const btnRecorridoProfundidad = document.getElementById("btnProfundidad");
const btnRecorridoAnchura = document.getElementById("btnAnchura");
const tbodyProfundidad = document.getElementById("tbodyProfundidad");
const tbodyAnchura = document.getElementById("tbodyAnchura");
const btnDijkstra = document.getElementById("dijkstraBtn");
const resultadoDijkstra = document.getElementById("dijkstraResult");

function mostrarAlerta(icon, title, message) {
    Swal.fire({
        icon: icon,
        title: title,
        text: message,
        confirmButtonColor: '#007bff'
    });
}

btnAgregarDestino.addEventListener("click", () => {
    const colonia = document.getElementById("destinoInput").value.trim();
    
    if (colonia !== "") {
        if (graph.addVertex(colonia)) {
            mostrarAlerta('success', 'Registro Exitoso', `Se registró la colonia ${colonia}`);
        } else {
            mostrarAlerta('Error', 'No se pudo registrar la colonia');
        }
    } else {
        mostrarAlerta('Error', 'Debe ingresar el nombre de la colonia');
    }
});

btnAgregarConexion.addEventListener("click", () => {
    const coloniaInicial = document.getElementById("inicioInput").value.trim();
    const coloniaDestino = document.getElementById("destinoFinalInput").value.trim();
    const peso = parseInt(document.getElementById("distanciaInput").value);

    if (coloniaInicial !== "" && coloniaDestino !== "" && !isNaN(peso)) {
        if (graph.addEdge(coloniaInicial, coloniaDestino, peso)) {
            mostrarAlerta('success', 'Conexión Agregada', 'La ruta se agregó correctamente');
        } else {
            mostrarAlerta('Error', 'No se pudo agregar la ruta');
        }
    } else {
        mostrarAlerta('Error', 'Debe ingresar ambas colonias y la distancia para la ruta');
    }
});

btnRecorridoProfundidad.addEventListener("click", () => {
    tbodyProfundidad.innerHTML = '';
    
    const vertices = [...graph.getVertices()];
    if (vertices.length === 0) {
        mostrarAlerta('Error', 'No hay colonias en el grafo');
        return;
    }

    graph.dfs(vertices[0], (vertex) => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = vertex;
        row.appendChild(cell);
        tbodyProfundidad.appendChild(row);
    });
    
    mostrarAlerta('info', 'Recorrido De Profundidad', 'Recorrido en profundidad completado');
});

btnRecorridoAnchura.addEventListener("click", () => {
    tbodyAnchura.innerHTML = '';
    
    const vertices = [...graph.getVertices()];
    if (vertices.length === 0) {
        mostrarAlerta( 'Error', 'No hay colonias en el grafo');
        return;
    }

    graph.bfs(vertices[0], (vertex) => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = vertex;
        row.appendChild(cell);
        tbodyAnchura.appendChild(row);
    });
    
    mostrarAlerta('info', 'Recorrido De Anchura', 'Recorrido en anchura completado');
});


btnDijkstra.addEventListener("click", () => {
    if (graph.numVertices() === 0) {
        mostrarAlerta('Error', 'no hay rutas guardadas');
        return;
    }

    const startNode = document.getElementById("startNodeDijkstra").value.trim();
    const endNode = document.getElementById("endNodeDijkstra").value.trim();

    if (startNode === "" || endNode === "" || !graph.getVertices().includes(startNode) || !graph.getVertices().includes(endNode)) {
        mostrarAlerta('info','Ingrese puntos de inicio y destino válidos');
        return;
    }

    const { path, distance } = graph.dijkstra(startNode, endNode);

    resultadoDijkstra.innerHTML = '';

    if (path.length) {
        let row = resultadoDijkstra.insertRow();
        let cellPath = row.insertCell(0);
        let cellTotal = row.insertCell(1);
        cellPath.innerHTML = path.join(' -> ');
        cellTotal.innerHTML = distance; // Muestra la distancia total
    } else {
        let row = resultadoDijkstra.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.innerHTML = 'No se encontró un camino';
    }
});
