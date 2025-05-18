const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');

const campos = ['codigo', 'depto', 'descripcion'];

const inputs = {};
campos.forEach(campo => {
    inputs[campo] = document.getElementById(campo);
});

const btnGuardar = document.getElementById('btnGuardarcontrato');

let departamentos = [];
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
            inputs[campo].value = departamentos[index][campo];
        });
        id = index;
    } else {
        campos.forEach(campo => {
            inputs[campo].value = '';
        });
        id = undefined;
    }
}

function editDepto(index) {
    openModal(true, index);
}

function deleteDepto(index) {
    departamentos.splice(index, 1);
    guardarDeptos();
    cargarDeptos();
}

function insertarDepto(depto, index) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${depto.codigo}</td>
        <td>${depto.depto}</td>
        <td>${depto.descripcion}</td>
        <td class="acao">
            <button onclick="editDepto(${index})"><i class="bx bx-edit"></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteDepto(${index})"><i class="bx bx-trash"></i></button>
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
        departamentos[id] = datos;
    } else {
        departamentos.push(datos);
    }

    guardarDeptos();
    modal.classList.remove('active');
    cargarDeptos();
};

function cargarDeptos() {
    departamentos = obtenerDeptos();
    tbody.innerHTML = '';
    departamentos.forEach((depto, index) => insertarDepto(depto, index));
}

const obtenerDeptos = () => JSON.parse(localStorage.getItem('departamentosBD')) ?? [];
const guardarDeptos = () => localStorage.setItem('departamentosBD', JSON.stringify(departamentos));

cargarDeptos();
