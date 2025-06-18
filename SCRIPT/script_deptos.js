function openModal() {
  const modal = document.querySelector('.modal');
  modal.classList.add('isactive');
}
function closeModal() {
  const modal = document.querySelector('.modal');
  modal.classList.remove('isactive');
  limpiarFormulario();
}

function limpiarFormulario() {
  document.getElementById('formdepto').reset();
}
//Guardar departamento
async function guardarDepartamento() {
  const depto = document.getElementById('depto');
  const descrip = document.getElementById('descripcion');

  if (!depto || !descrip ) {
    alert("Error al leer los campos del formulario.");
    return;
  }

  const data = {
    nombre_departamento: depto.value.trim(),
    descripcion: descrip.value.trim()
  };

  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/departamentos/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result)

    if (response.ok) {
      alert("Departamento registrado con éxito");
      document.getElementById('formdepto').reset();
      closeModal(); //cerrar el modal
      cargarDepartamentos(); //recargar la tabla
    } else {
      alert(result.Message || "No se pudo registrar el departamento.");
    }
  } catch (error) {
    console.error("Error al registrar el departamento:", error);
    alert("Ocurrió un error al conectar con el servidor.");
  }
}

//LLENAR LA TABLA
document.addEventListener('DOMContentLoaded', () => {
  cargarDepartamentos(); // al cargar la página
});

async function cargarDepartamentos() {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/departamentos/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success) {
      mostrarDepartamentosEnTabla(result.Record);
    } else {
      alert(result.Message || "No se pudieron obtener los departamentos.");
    }

  } catch (error) {
    console.error("Error al cargar departamentos:", error);
    alert("Error de conexión al cargar departamentos.");
  }
}

function mostrarDepartamentosEnTabla(deptos) {
  const tbody = document.querySelector('.department__table tbody');
  tbody.innerHTML = ''; // limpia la tabla

  deptos.forEach(emp => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${emp.nombre_departamento}</td>
      <td>${emp.descripcion}</td>
      <td><button class="btn btn-sm btn-warning btn-editar-empleado">Editar</button></td>
      <td><button class="btn btn-sm btn-danger btn-eliminar-empleado">Eliminar</button></td>`;

    tbody.appendChild(fila);
  });
}

///
document.getElementById('btnGuardarDepartamento').addEventListener('click', function(e) {
  e.preventDefault();
  guardarDepartamento();
});


// Buscar departamento
const btnBuscar = document.getElementById('btnBuscarDepto');
if (btnBuscar) {
  btnBuscar.addEventListener('click', buscarDepto);
}

async function buscarDepto() {
  const inputBuscar = document.getElementById('inputBuscarDepto');
  const nombre = inputBuscar.value.trim();

  if (!nombre) {
    alert("Por favor, ingresa un nombre de departamento.");
    return;
  }

  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch(`http://127.0.0.1:8000/adminrh/departamentos/?nombre_depto=${nombre}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success && result.Record.length > 0) {
      const depto = result.Record[0];
      mostrarDepartamentoSoloLectura(depto);
    } else {
      alert(result.Message || "Departamento no encontrado.");
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    alert("Ocurrió un error al buscar el departamento.");
  }
}

function mostrarDepartamentoSoloLectura(depto) {
  document.getElementById('depto').value = depto.nombre_departamento;
  document.getElementById('descripcion').value = depto.descripcion;

  // Deshabilitar todos los inputs del formulario
  document.querySelectorAll('#formdepto input, #formdepto select, #btnGuardarDepartamento')
    .forEach(elem => {
      elem.disabled = true;
    });

  openModal();
}

// Al cerrar el modal, volver a activar los campos
function closeModal() {
  const modal = document.querySelector('.modal');
  modal.classList.remove('isactive');
  limpiarFormulario();
  document.querySelectorAll('#formdepto input, #formdepto select, #btnGuardarDepartamento')
    .forEach(elem => {
      elem.disabled = false;
    });
}
