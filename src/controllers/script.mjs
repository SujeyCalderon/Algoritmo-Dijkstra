import Graph from "../models/Graph.mjs";

const graph = new Graph();

const btnAgregarDestino = document.getElementById("agregarDestinoBtn");
const btnAgregarConexion = document.getElementById("agregarRutaBtn");
const btnRecorridoProfundidad = document.getElementById("btnProfundidad");
const btnRecorridoAnchura = document.getElementById("btnAnchura");
const tbodyProfundidad = document.getElementById("tbodyProfundidad");
const tbodyAnchura = document.getElementById("tbodyAnchura");
const tbodyDijkstra = document.getElementById("tbodyDijkstra");
const btnRedMasRapida = document.getElementById("redMasRapida");

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

    const inicioDijkstra = document.getElementById("inicioDijkstra").value.trim();
    console.log("Inicio Dijkstra:", inicioDijkstra); 

    if (inicioDijkstra !== "") {
        const distances = graph.dijkstra(inicioDijkstra);
        console.log("Distancias calculadas:", distances); 
        if (distances) {
            for (let [node, distance] of Object.entries(distances)) {
                const row = document.createElement('tr');
                const cellNode = document.createElement('td');
                const cellDistance = document.createElement('td');
                cellNode.textContent = node;
                cellDistance.textContent = distance === Infinity ? 'Infinito' : distance;
                row.appendChild(cellNode);
                row.appendChild(cellDistance);
                tbodyDijkstra.appendChild(row);
            }

            Swal.fire({
                icon: 'success',
                title: 'Rutas Más Rápidas',
                text: `Se calcularon las distancias más rápidas desde ${inicioDijkstra}`,
                confirmButtonColor: '#007bff'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró una ruta desde la red especificada',
                confirmButtonColor: '#007bff'
            });
        }
    } else {
        mostrarAlerta('error', 'Error', 'Debe ingresar la red de inicio');
    }
});
