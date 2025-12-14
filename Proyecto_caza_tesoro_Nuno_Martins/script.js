"use strict";

// Variables Principales
let nombre = "";
let heroeFila = 0;
let heroeCol = 0;
let numeroTiradas = 0;
let puedeTirar = true;
let juegoTerminado = false;

// Elementos del DOM
let inputNombre;
let botonNombre;
let mensaje;
let botonJugar;
let tablero;
let botonDado;

// Cuando la página se carga, se inicia el juego
window.onload = iniciarJuego;

// Obtiene los elementos del DOM y asigna los eventos
function iniciarJuego()
{
    // Obtener referencias a los elementos HTML
    inputNombre = document.getElementById("nombre");
    botonNombre = document.getElementById("botonNombre");
    mensaje = document.getElementById("mensaje");
    botonJugar = document.getElementById("botonJugar");
    tablero = document.getElementById("tablero");
    botonDado = document.getElementById("botonDado");


    // Evento para validar el nombre del jugador
    botonNombre.addEventListener("click", validarNombre);
    
    // Evento para iniciar la partida
    botonJugar.addEventListener("click", () => {
        generarTablero(tablero); // Genera el tablero
        botonJugar.style.display = "none"; // Oculta el boton de jugar
        botonDado.style.display = "inline-block"; // Muestra el dado
    });

    // Evento para lanzar el dado
    botonDado.addEventListener("click", tirarDado);
}

    // Valida el nombre introducido por el usuario
    function validarNombre(){

        // Quitar espacios al principio y al final
        nombre = inputNombre.value.trim();

        // Validar si el nombre contiene al menos 4 letras
        if(nombre.length < 4)
        {
            mensaje.textContent = "El nombre debe tener 4 o más letras";
            botonJugar.disabled = true;
            return;
        }
        // Comprueba que no contenga números el nombre
        else if (/\d/.test(nombre))
        {
            mensaje.textContent = "Números no permitidos";
            botonJugar.disabled = true;
            return;
        }
        // Si el nombre es válido, permite jugar
        else
        {
            mensaje.textContent = `A luchar héroe: ${nombre}`;
            botonJugar.disabled = false;
        }
    };

    // Simula la tirada del dado
    function tirarDado(){
        // Evita tirar si no es el turno o el juego a acabado
        if (!puedeTirar || juegoTerminado) return;

        // Genera un número aleatorio entre 1 y 6
        let pasos = Math.floor(Math.random() * 6) + 1;
        numeroTiradas++;

        // Cambiar la imagen del dado
        document.getElementById("imagenDado").src = `./img/dado${pasos}.jpg`;

        // Desactiva nuevas tiradas y marca movimientos posibles
        puedeTirar = false;
        marcarCeldas(pasos);
};

// Función que crea el tablero de 10×10
function generarTablero(tablero) {
    let html = "<table>";

    for (let fila = 0; fila < 10; fila++) {
        html += "<tr>";

        for (let col = 0; col < 10; col++) {

            // Imagen por defecto: suelo
            let contenido = `<img src="./img/suelo.jpeg" width="40">`;

            // Coloca al héroe en la posición inicial (0,0)
            if (fila === 0 && col === 0) {
                contenido = `<img src="./img/heroe.jpeg" width="40" id="heroe">`;
            }

            // Coloca el cofre en la posición final (9,9)
            if (fila === 9 && col === 9) {
                contenido = `<img src="./img/cofre.jpeg" width="40" id="cofre">`;
            }
            // Asigna un id único a cada celda
            html += `<td id="c${fila}-${col}">${contenido}</td>`;
        }

        html += "</tr>";
    }

    html += "</table>";
    tablero.innerHTML = html;
}

// Marca en rojo las celdas a las que el héroe puede moverse
function marcarCeldas(pasos) {

    limpiarCeldas();

    // ARRIBA
    for (let i = 1; i <= pasos; i++) {
        if (heroeFila - i >= 0) {
            pintar(heroeFila - i, heroeCol);
        }
    }

    // ABAJO
    for (let i = 1; i <= pasos; i++) {
        if (heroeFila + i < 10) {
            pintar(heroeFila + i, heroeCol);
        }
    }

    // IZQUIERDA
    for (let i = 1; i <= pasos; i++) {
        if (heroeCol - i >= 0) {
            pintar(heroeFila, heroeCol - i);
        }
    }

    // DERECHA
    for (let i = 1; i <= pasos; i++) {
        if (heroeCol + i < 10) {
            pintar(heroeFila, heroeCol + i);
        }
    }
}


// Resalta una celda y le asigna el movimiento
function pintar(fila, col) {
    const celda = document.getElementById(`c${fila}-${col}`);
    celda.classList.add("mover");
    celda.onclick = () => moverHeroe(fila, col);
}


// Mueve al héroe a la celda seleccionada
function moverHeroe(fila, col) {

    // Borra la posición anterior
    document.getElementById(`c${heroeFila}-${heroeCol}`).innerHTML = `<img src="./img/suelo.jpeg" width="40">`;
    
    // Actualiza la posición
    heroeFila = fila;
    heroeCol = col;
    
    // Dibuja al héroe en la nueva posición
    document.getElementById(`c${heroeFila}-${heroeCol}`).innerHTML = `<img src="./img/heroe.jpeg" width="40">`;

    limpiarCeldas();
    puedeTirar = true;
    comprobarVictoria();
}

// Elimina las celdas marcadas como movibles
function limpiarCeldas() {
    document.querySelectorAll(".mover").forEach(c => {
        c.classList.remove("mover");
        c.onclick = null;
    });
}

// Comprueba si el héroe ha llegado al cofre
function comprobarVictoria() {

    if (heroeFila === 9 && heroeCol === 9) {

        juegoTerminado = true;
        botonDado.disabled = true;

        // Obtiene el récord almacenado
        let recordTiradas  = localStorage.getItem("recordTiradas");

        // Comprueba si es un nuevo récord
        if (recordTiradas  === null || numeroTiradas  < recordTiradas) {
            localStorage.setItem("recordTiradas", numeroTiradas);
            alert(`¡Victoria! Nuevo récord: ${numeroTiradas} tiradas`);
        }
        else {
            alert(`¡Victoria! Tiradas usadas: ${numeroTiradas}\nRécord no superado, el actual récord es ${recordTiradas}`);
        }
    }
}