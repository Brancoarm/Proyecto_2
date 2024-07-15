const crearEncuesta = (titulo, preguntas) => ({ titulo, preguntas, votos: [] });

const agregarPregunta = (encuesta, pregunta) => ({
    ...encuesta,
    preguntas: [...encuesta.preguntas, pregunta]
});

const votar = (encuesta, voto) => ({
    ...encuesta,
    votos: [...encuesta.votos, voto]
});

const obtenerResultados = encuesta => encuesta.preguntas.map((pregunta, indice) => {
    const conteoVotos = encuesta.votos.reduce((conteos, voto) => {
        const respuesta = voto[indice];
        conteos[respuesta] = conteos[respuesta] ? conteos[respuesta] + 1 : 1;
        return conteos;
    }, {});
    return { pregunta, conteoVotos };
});

let encuestas = [];

document.getElementById('agregar-pregunta').addEventListener('click', () => {
    const divPreguntas = document.getElementById('preguntas');
    const divPregunta = document.createElement('div');
    divPregunta.innerHTML = `
        <input type="text" placeholder="Pregunta">
        <input type="text" placeholder="Opción 1">
        <input type="text" placeholder="Opción 2">
    `;
    divPreguntas.appendChild(divPregunta);
});

document.getElementById('crear-encuesta').addEventListener('click', () => {
    const titulo = document.getElementById('titulo-encuesta').value;
    const preguntas = Array.from(document.getElementById('preguntas').children).map(div => ({
        pregunta: div.children[0].value,
        opciones: [div.children[1].value, div.children[2].value]
    }));

    let encuesta = crearEncuesta(titulo, []);
    preguntas.forEach(p => encuesta = agregarPregunta(encuesta, p));
    encuestas.push(encuesta);
    mostrarEncuestas();
});

const mostrarEncuestas = () => {
    const listaEncuestas = document.getElementById('encuestas');
    listaEncuestas.innerHTML = '';
    encuestas.forEach((encuesta, indice) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${encuesta.titulo} <button onclick="votarEncuesta(${indice})">Votar</button> <button onclick="verResultados(${indice})">Ver Resultados</button>
        `;
        listaEncuestas.appendChild(li);
    });
};

const votarEncuesta = indice => {
    let encuesta = encuestas[indice];
    const votos = encuesta.preguntas.map(pregunta => prompt(`${pregunta.pregunta} (${pregunta.opciones.join('/')})`));
    encuesta = votar(encuesta, votos);
    encuestas[indice] = encuesta;
    alert('Voto registrado');
};

const verResultados = indice => {
    const encuesta = encuestas[indice];
    const divResultados = document.getElementById('resultados');
    divResultados.innerHTML = '';
    const resultados = obtenerResultados(encuesta);
    resultados.forEach(resultado => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${resultado.pregunta.pregunta}</h3>
            <p>${Object.entries(resultado.conteoVotos).map(([opcion, conteo]) => `${opcion}: ${conteo}`).join(', ')}</p>
        `;
        divResultados.appendChild(div);
    });
};

document.addEventListener('DOMContentLoaded', mostrarEncuestas);
