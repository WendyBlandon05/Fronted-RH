const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');


const campos = ['codigo', 'name-cargo', 'descripcion', 'salario'];

const inputs = {};
campos.forEach(campo => {
    inputs[campo] = document.getElementById(campo);
});

const btnGuardar = document.getElementById('btnGuardarcontrato');

let cargos = [];
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
            inputs[campo].value = cargos[index][campo];
        });
        id = index;
    } else {
        campos.forEach(campo => {
            inputs[campo].value = '';
        });
        id = undefined;
    }
}

function editCargo(index) {
    openModal(true, index);
}

function deleteCargo(index) {
    cargos.splice(index, 1);
    guardarCargos();
    cargarCargos();
}

function insertarCargo(cargo, index) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${cargo['codigo']}</td>
        <td>${cargo['name-cargo']}</td>
        <td>${cargo['descripcion']}</td>
        <td>${cargo['salario']}</td>
        <td class="acao">
            <button onclick="editCargo(${index})"><i class="bx bx-edit"></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteCargo(${index})"><i class="bx bx-trash"></i></button>
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
        cargos[id] = datos;
    } else {
        cargos.push(datos);
    }

    guardarCargos();
    modal.classList.remove('active');
    cargarCargos();
};

function cargarCargos() {
    cargos = obtenerCargos();
    tbody.innerHTML = '';
    cargos.forEach((cargo, index) => insertarCargo(cargo, index));
}

const obtenerCargos = () => JSON.parse(localStorage.getItem('cargosBD')) ?? [];
const guardarCargos = () => localStorage.setItem('cargosBD', JSON.stringify(cargos));

cargarCargos();
