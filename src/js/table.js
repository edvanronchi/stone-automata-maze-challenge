import {matrizes, movimentacoes, qtdAlturaMatriz, qtdLarguraMatriz, passos_campeao} from './engine.js';

const ENUMS = {
    DECREASE: 'DECREASE',
    INCREASE: 'INCREASE',
    QTD_MATRIZES: matrizes.length - 1
};
const sizeTd = 700 / qtdLarguraMatriz;
const tableMatriz = document.getElementById("tableMatriz");
const buttonPrevious = document.getElementById("button_previous");
const buttonStop = document.getElementById("button_stop");
const buttonNext = document.getElementById("button_next");
const buttonKeep = document.getElementById("button_keep");
const inputCount = document.getElementById("input_count");

let numero_passo = 0;
let intervalId;

init();

function init() {
    createTable();
    configButtonInput();

    buttonPrevious.addEventListener("click", previous);
    buttonStop.addEventListener("click", stop);
    buttonNext.addEventListener("click", next);
    buttonKeep.addEventListener("click", keep);
    inputCount.addEventListener("change", changeInput);

}

function createTable() {
    let matriz = matrizes[numero_passo];
    for (let rowVetor = 0; rowVetor < qtdAlturaMatriz; rowVetor++) {
        let row = tableMatriz.insertRow(rowVetor);
        for (let rowCasa = 0; rowCasa < qtdLarguraMatriz; rowCasa++) {
            let cell = row.insertCell(rowCasa);
            setCell(cell, matriz[rowVetor][rowCasa], { rowVetor, rowCasa });
        }
    }
}
function setCell(cell, casa, posicao) {
    cell.style.backgroundColor = getColor(casa, posicao);
    cell.style.width = sizeTd + "px";
    cell.style.height = sizeTd + "px";
    cell.style.border = "2px solid black";
}

function getColor(casa, posicao) {
    let color = "white";
    let has_movimento = movimentacoes[numero_passo]
        .some(m => m.rowVetor === posicao.rowVetor && m.rowCasa === posicao.rowCasa);
    let { rowVetor, rowCasa } =  passos_campeao[numero_passo];

    if (casa === 1 && has_movimento) {
        alert("Tem alguma coisa errada!")
        return;
    }

    if (casa === 1) {
        color = "#00A868";
    } else if (rowVetor === posicao.rowVetor && rowCasa === posicao.rowCasa) {
        color = "blue";
    } else if ((casa === 3 && numero_passo === 0) || has_movimento) {
        color = "#e83b3b";
    } else if (casa === 4) {
        color = "yellow";
    }

    return color;
}

function updateTable() {
    let matriz = matrizes[numero_passo];
    for (let rowVetor = 0; rowVetor < qtdAlturaMatriz; rowVetor++) {
        for (let rowCasa = 0; rowCasa < qtdLarguraMatriz; rowCasa++) {
            let cell = tableMatriz.rows[rowVetor].cells[rowCasa];
            let casa = matriz[rowVetor][rowCasa];
            setCell(cell, casa, { rowVetor, rowCasa });
        }
    }
}

function changeInput() {
    let count = this.value ? parseInt(this.value) : 0;

    if (count >= ENUMS.QTD_MATRIZES) {
        count = ENUMS.QTD_MATRIZES;
    }
    numero_passo = count;

    configButtonInput();
    updateTable();
}

function next() {
    setNumeroPasso(ENUMS.INCREASE);
    updateTable();
}

function stop() {
    clearInterval(intervalId);
    intervalId = null;
}

function previous() {
    setNumeroPasso(ENUMS.DECREASE);
    updateTable();
}

function keep() {
    if (intervalId) {
        return;
    }

    intervalId = setInterval(() => {
        if (numero_passo >= ENUMS.QTD_MATRIZES) {
            stop();
            return;
        }
        next();
    });
}

function setNumeroPasso(operation) {
    if (operation === ENUMS.INCREASE) {
        numero_passo++;
    } else {
        numero_passo--;
    }
    configButtonInput();
}

function configButtonInput() {
    buttonPrevious.disabled = false;
    buttonNext.disabled = false;
    buttonKeep.disabled = false;
    inputCount.value = numero_passo;

    if (numero_passo === 0) {
        buttonPrevious.disabled = true;
    }else if (numero_passo === ENUMS.QTD_MATRIZES) {
        buttonNext.disabled = true;
        buttonKeep.disabled = true;
    }
}
