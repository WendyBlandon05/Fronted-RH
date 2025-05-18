const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');

const campos = [
    'nombres', 'apellidos', 'cedula', 'inss', 'salario', 'cargo', 'direccion', 'telefono', 'sexo', 'correo'
];

const inputs = {};
campos.forEach(campo => {
    inputs[campo] = document.getElementById(campo);
});

const btnGuardar = document.getElementById('btnGuardar');

let empleados = [];
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
            inputs[campo].value = empleados[index][campo];
        });
        document.getElementById('archivoEmpleado').value = ''; // Limpiar input file
        id = index;
    } else {
        campos.forEach(campo => {
            inputs[campo].value = '';
        });
        document.getElementById('archivoEmpleado').value = ''; // Limpiar input file
        id = undefined;
    }
}

function editEmpleado(index) {
    openModal(true, index);
}

function deleteEmpleado(index) {
    empleados.splice(index, 1);
    guardarEmpleados();
    cargarEmpleados();
}

function insertarEmpleado(empleado, index) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${empleado.nombres}</td>
        <td>${empleado.apellidos}</td>
        <td>${empleado.cedula}</td>
        <td>${empleado.inss}</td>
        <td>${empleado.salario}</td>
        <td>${empleado.cargo}</td>
        <td>${empleado.direccion}</td>
        <td>${empleado.telefono}</td>
        <td>${empleado.sexo}</td>
        <td>${empleado.correo}</td>
        <td>${empleado.archivo ? empleado.archivo : 'No hay archivo'}</td>
        <td class="acao">
            <button onclick="editEmpleado(${index})"><i class="bx bx-edit"></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteEmpleado(${index})"><i class="bx bx-trash"></i></button>
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

    const archivo = document.getElementById('archivoEmpleado').files[0];
    if (archivo) {
        datos.archivo = archivo.name;
    }

    if (id !== undefined) {
        empleados[id] = datos;
    } else {
        empleados.push(datos);
    }

    guardarEmpleados();
    modal.classList.remove('active');
    cargarEmpleados();
};

function cargarEmpleados() {
    empleados = obtenerEmpleados();
    tbody.innerHTML = '';
    empleados.forEach((empleado, index) => insertarEmpleado(empleado, index));
}

const obtenerEmpleados = () => JSON.parse(localStorage.getItem('empleadosBD')) ?? [];
const guardarEmpleados = () => localStorage.setItem('empleadosBD', JSON.stringify(empleados));

cargarEmpleados();

