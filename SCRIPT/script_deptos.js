// Elementos principales
const modal = document.getElementById('modaldepto');
const tbody = document.querySelector('tbody');

// Campos a capturar
const campos = ['depto', 'descripcion'];

// Inputs por ID
const inputs = {};
campos.forEach(campo => {
    inputs[campo] = document.getElementById(campo);
});

// Botón guardar
const btnGuardar = document.getElementById('btnGuardarDepartamento');

let departamentos = [];
let id;

// Función para abrir modal
function openModal(edit = false, index = 0) {
    modal.classList.add('isactive');

    // Cierre del modal al hacer clic fuera del contenido
    modal.onclick = e => {
        if (e.target === modal) {
            modal.classList.remove('isactive');
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

// Editar un departamento
function editDepto(index) {
    openModal(true, index);
}

// Eliminar un departamento
function deleteDepto(index) {
    departamentos.splice(index, 1);
    guardarDeptos();
    cargarDeptos();
}

// Insertar fila en tabla
function insertarDepto(depto, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${depto.depto}</td>
        <td>${depto.descripcion}</td>
        <td class="department__action">
            <button onclick="editDepto(${index})"><i class="bx bx-edit"></i></button>
        </td>
        <td class="department__action">
            <button onclick="deleteDepto(${index})"><i class="bx bx-trash"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

// Evento guardar
btnGuardar.onclick = e => {
    e.preventDefault();

    const datos = {};
    for (let campo of campos) {
        const valor = inputs[campo].value.trim();
        if (!valor) return;
        datos[campo] = valor;
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

// Cargar departamentos al iniciar
function cargarDeptos() {
    departamentos = obtenerDeptos();
    tbody.innerHTML = '';
    departamentos.forEach((depto, index) => insertarDepto(depto, index));
}

// LocalStorage helpers
const obtenerDeptos = () => JSON.parse(localStorage.getItem('departamentosBD')) ?? [];
const guardarDeptos = () => localStorage.setItem('departamentosBD', JSON.stringify(departamentos));

// Inicializar
cargarDeptos();
