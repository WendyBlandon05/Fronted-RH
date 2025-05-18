const modal = document.getElementById('modalbeneficio');
const tbody = document.querySelector('tbody');


const campos = ['name', 'name-cargo', 'descripcion', 'monto'];
const inputs = {};
campos.forEach(campo => {
    inputs[campo] = document.getElementById(campo);
});

const btnGuardar = document.getElementById('btnGuardarcontrato');

let beneficios = [];
let id = undefined;

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.classList.contains('modal-container')) {
            modal.classList.remove('active');
        }
    };

    if (edit) {
        campos.forEach(campo => {
            inputs[campo].value = beneficios[index][campo];
        });
        id = index;
    } else {
        campos.forEach(campo => {
            inputs[campo].value = '';
        });
        id = undefined;
    }
}

function editBeneficio(index) {
    openModal(true, index);
}

function deleteBeneficio(index) {
    beneficios.splice(index, 1);
    guardarBeneficios();
    cargarBeneficios();
}

function insertarBeneficio(beneficio, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${beneficio['name']}</td>
        <td>${beneficio['name-cargo']}</td>
        <td>${beneficio['descripcion']}</td>
        <td>${beneficio['monto']}</td>
        <td class="acao">
            <button onclick="editBeneficio(${index})"><i class="bx bx-edit"></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteBeneficio(${index})"><i class="bx bx-trash"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

btnGuardar.onclick = e => {
    e.preventDefault();

    const datos = {};
    for (const campo of campos) {
        if (inputs[campo].value.trim() === '') {
            alert('Todos los campos son obligatorios.');
            return;
        }
        datos[campo] = inputs[campo].value;
    }

    if (id !== undefined) {
        beneficios[id] = datos;
    } else {
        beneficios.push(datos);
    }

    guardarBeneficios();
    modal.classList.remove('active');
    cargarBeneficios();
}

function cargarBeneficios() {
    beneficios = obtenerBeneficios();
    tbody.innerHTML = '';
    beneficios.forEach((beneficio, index) => insertarBeneficio(beneficio, index));
}

const obtenerBeneficios = () => JSON.parse(localStorage.getItem('beneficiosBD')) ?? [];
const guardarBeneficios = () => localStorage.setItem('beneficiosBD', JSON.stringify(beneficios));


cargarBeneficios();
