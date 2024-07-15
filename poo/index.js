class Encuesta {
    constructor(titulo) {
        this.titulo = titulo;
        this.preguntas = [];
        this.votos = [];
    }

    agregarPregunta(pregunta) {
        this.preguntas.push(pregunta);
    }

    votar(votos) {
        this.votos.push(votos);
    }

    obtenerResultados() {
        const resultados = this.preguntas.map((pregunta, indice) => {
            const conteoVotos = this.votos.reduce((conteos, voto) => {
                const respuesta = voto[indice];
                conteos[respuesta] = conteos[respuesta] ? conteos[respuesta] + 1 : 1;
                return conteos;
            }, {});
            return { pregunta, conteoVotos };
        });
        return resultados;
    }
}

class AplicacionEncuestas {
    constructor() {
        this.encuestas = [];
        this.iniciar();
    }

    iniciar() {
        document.getElementById('agregar-pregunta').addEventListener('click', () => this.agregarPregunta());
        document.getElementById('crear-encuesta').addEventListener('click', () => this.crearEncuesta());
    }

    agregarPregunta() {
        const divPreguntas = document.getElementById('preguntas');
        const divPregunta = document.createElement('div');
        divPregunta.innerHTML = `
            <input type="text" placeholder="Pregunta">
            <input type="text" placeholder="Opción 1">
            <input type="text" placeholder="Opción 2">
        `;
        divPreguntas.appendChild(divPregunta);
    }

    crearEncuesta() {
        const titulo = document.getElementById('titulo-encuesta').value;
        const preguntas = Array.from(document.getElementById('preguntas').children).map(div => ({
            pregunta: div.children[0].value,
            opciones: [div.children[1].value, div.children[2].value]
        }));

        const encuesta = new Encuesta(titulo);
        preguntas.forEach(p => encuesta.agregarPregunta(p));
        this.encuestas.push(encuesta);
        this.mostrarEncuestas();
    }

    mostrarEncuestas() {
        const listaEncuestas = document.getElementById('encuestas');
        listaEncuestas.innerHTML = '';
        this.encuestas.forEach((encuesta, indice) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${encuesta.titulo} <button onclick="app.votarEncuesta(${indice})">Votar</button> <button onclick="app.verResultados(${indice})">Ver Resultados</button>
            `;
            listaEncuestas.appendChild(li);
        });
    }

    votarEncuesta(indice) {
        const encuesta = this.encuestas[indice];
        const votos = encuesta.preguntas.map(pregunta => prompt(`${pregunta.pregunta} (${pregunta.opciones.join('/')})`));
        encuesta.votar(votos);
        alert('Voto registrado');
    }

    verResultados(indice) {
        const encuesta = this.encuestas[indice];
        const divResultados = document.getElementById('resultados');
        divResultados.innerHTML = '';
        const resultados = encuesta.obtenerResultados();
        resultados.forEach(resultado => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>${resultado.pregunta.pregunta}</h3>
                <p>${Object.entries(resultado.conteoVotos).map(([opcion, conteo]) => `${opcion}: ${conteo}`).join(', ')}</p>
            `;
            divResultados.appendChild(div);
        });
    }
}

const app = new AplicacionEncuestas();
