const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');

const campos = [
    'codigo', 'fechainicio', 'fechafinal', 'depto', 'tipo', 'cedula', 'jornada'
];

const inputs = {};
campos.forEach(campo => {
    inputs[campo] = document.getElementById(campo);
});

const btnGuardar = document.getElementById('btnGuardarcontrato');

let contratos = [];
let id;

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    };

    if (edit) {
        campos.forEach(campo => {
            inputs[campo].value = contratos[index][campo];
        });
        id = index;
    } else {
        campos.forEach(campo => {
            inputs[campo].value = '';
        });
        id = undefined;
    }
}

function editContrato(index) {
    openModal(true, index);
}

function deleteContrato(index) {
    contratos.splice(index, 1);
    guardarContratos();
    cargarContratos();
}

function insertarContrato(contrato, index) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${contrato.codigo}</td>
        <td>${contrato.fechainicio}</td>
        <td>${contrato.fechafinal}</td>
        <td>${contrato.depto}</td>
        <td>${contrato.tipo}</td>
        <td>${contrato.cedula}</td>
        <td>${contrato.jornada}</td>
        <td class="acao">
            <button onclick="editContrato(${index})"><i class="bx bx-edit"></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteContrato(${index})"><i class="bx bx-trash"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

btnGuardar.onclick = e => {
    e.preventDefault();

    let datos = {};
    for (let campo of campos) {
        if (inputs[campo].value.trim() === '') return;
        datos[campo] = inputs[campo].value;
    }

    if (id !== undefined) {
        contratos[id] = datos;
    } else {
        contratos.push(datos);
    }

    guardarContratos();
    modal.classList.remove('active');
    cargarContratos();
};

function cargarContratos() {
    contratos = obtenerContratos();
    tbody.innerHTML = '';
    contratos.forEach((contrato, index) => insertarContrato(contrato, index));
}

const obtenerContratos = () => JSON.parse(localStorage.getItem('contratosBD')) ?? [];
const guardarContratos = () => localStorage.setItem('contratosBD', JSON.stringify(contratos));

cargarContratos();
