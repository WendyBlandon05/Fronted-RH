function openModal() {
    const modal = document.getElementById('modalCargo');
    modal.classList.add('isactive');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modalCargo');
    modal.classList.remove('isactive');
    modal.style.display = 'none';
    limpiarFormulario();
    document.querySelectorAll('#formcargo input, #formcargo select, #btnGuardarCargos')
        .forEach(elem => elem.disabled = false);
}

function limpiarFormulario() {
    document.getElementById('formcargo').reset();
}

//guardar cargoss
async function guardarCargo() {
    const cargo = document.getElementById('name-cargo');
    const descripcion = document.getElementById('descripcion');
    const salario = document.getElementById('salario');

    if (!cargo || !descripcion || !salario) {
        alert("Error al leer los campos del formulario.");
        return;
    }

    const data = {
        nombre_cargo: cargo.value.trim(),
        descripcion: descripcion.value.trim(),
        salario_base: Number(salario.value)
    };

    const accessToken = localStorage.getItem('access_token');

    try {
        const response = await fetch('http://127.0.0.1:8000/adminrh/cargos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);

        if (response.ok && result.Success) {
            alert("Cargo registrado con éxito");
            closeModal();
            cargarCargos();
        } else {
            alert(result.Message || "No se pudo registrar el Cargo.");
        }
    } catch (error) {
        console.error("Error al registrar el Cargo:", error);
        alert("Ocurrió un error al conectar con el servidor.");
    }
}

// CARGAR CARGOS EN TABLA
async function cargarCargos() {
    const accessToken = localStorage.getItem('access_token');

    try {
        const response = await fetch('http://127.0.0.1:8000/adminrh/cargos/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const result = await response.json();

        if (response.ok && result.Success) {
            mostrarCargosEnTabla(result.Record);
        } else {
            alert(result.Message || "No se pudo obtener los cargos.");
        }
    } catch (error) {
        console.error("Error al cargar cargos:", error);
        alert("Error de conexión al cargar cargos.");
    }
}

// Mostrar cargos
function mostrarCargosEnTabla(cargos) {
    const tbody = document.querySelector('.department__table tbody');
    tbody.innerHTML = '';

    cargos.forEach(cargo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${cargo.nombre_cargo}</td>
            <td>${cargo.descripcion}</td>
            <td>${cargo.salario_base}</td>
            <td><button class="btn btn-sm btn-warning btn-editar-cargo">Editar</button></td>
            <td><button class="btn btn-sm btn-danger btn-eliminar-cargo">Eliminar</button></td>
        `;
        tbody.appendChild(fila);
    });
}

// buscar por input
async function buscarCargos() {
    const inputBuscar = document.querySelector('.search-bar__input');
    const nombre = inputBuscar.value.trim();

    if (!nombre) {
        alert("Por favor, ingresa un nombre de cargo para buscar.");
        return;
    }

    const accessToken = localStorage.getItem('access_token');

    try {
        const response = await fetch(`http://127.0.0.1:8000/adminrh/cargos/?nombre_cargo=${nombre}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const result = await response.json();

        if (response.ok && result.Success && result.Record.length > 0) {
            const cargo = result.Record[0];
            mostrarCargoSoloLectura(cargo);
        } else {
            alert(result.Message || "Cargo no encontrado.");
        }
    } catch (error) {
        console.error("Error al buscar cargo:", error);
        alert("Ocurrió un error al buscar el cargo.");
    }
}

// mostrar para LECTURA
function mostrarCargoSoloLectura(cargo) {
    document.getElementById('name-cargo').value = cargo.nombre_cargo;
    document.getElementById('descripcion').value = cargo.descripcion;
    document.getElementById('salario').value = cargo.salario_base;

    document.querySelectorAll('#formcargo input, #formcargo select, #btnGuardarCargos')
        .forEach(elem => elem.disabled = true);

    openModal();
}

// EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    cargarCargos();

    const btnGuardar = document.getElementById('btnGuardarCargos');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function (e) {
            e.preventDefault();
            guardarCargo();
        });
    }

    const btnBuscar = document.querySelector('.search-bar__button');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarCargos);
    }
});
