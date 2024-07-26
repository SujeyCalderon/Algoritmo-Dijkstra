import Graph from "../models/Graph.mjs";

const graph = new Graph();

const btnAgregarDestino = document.getElementById("agregarDestinoBtn");
const btnAgregarConexion = document.getElementById("agregarRutaBtn");
const btnRecorridoProfundidad = document.getElementById("btnProfundidad");
const btnRecorridoAnchura = document.getElementById("btnAnchura");
const btnRedMasRapida = document.getElementById("btnRutaCorta");
const tbodyProfundidad = document.getElementById("tbodyProfundidad");
const tbodyAnchura = document.getElementById("tbodyAnchura");
const tbodyDijkstra = document.getElementById("tbodyDijkstra");

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

btnRedMasRapida.addEventListener("click", () => {
    tbodyDijkstra.innerHTML = '';

    const rutaInicio = document.getElementById("rutaInicio").value.trim();
    const rutaDestino = document.getElementById("rutaDestino").value.trim();

    if (rutaInicio !== "" && rutaDestino !== "") {
        const distancia = graph.dijkstra(rutaInicio, rutaDestino);
        if (distancia !== Infinity) {
            const row = document.createElement('tr');
            const cellInicio = document.createElement('td');
            const cellDestino = document.createElement('td');
            const cellDistance = document.createElement('td');
            cellInicio.textContent = rutaInicio;
            cellDestino.textContent = rutaDestino;
            cellDistance.textContent = distancia;
            row.appendChild(cellInicio);
            row.appendChild(cellDestino);
            row.appendChild(cellDistance);
            tbodyDijkstra.appendChild(row);

            mostrarAlerta('success', 'Ruta Más Rápida', `La distancia más rápida entre ${rutaInicio} y ${rutaDestino} es ${distancia}`);
        } else {
            mostrarAlerta('Error', 'No se encontró una ruta entre las colonias especificadas');
        }
    } else {
        mostrarAlerta('Error', 'Debe ingresar ambas colonias para encontrar la ruta más rápida');
    }
});
