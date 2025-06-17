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
  document.getElementById('formEmpleado').reset();
}

//document.addEventListener('DOMContentLoaded', () => {
//  const btnGuardar = document.getElementById('btnGuardarEmpleado');
  //if (btnGuardar) {
    //btnGuardar.addEventListener('click', guardarEmpleado);
  //}
//});

async function guardarEmpleado() {
  const cedula = document.getElementById('cedula');
  const inss = document.getElementById('inss');
  const nombre1 = document.getElementById('nombre1');
  const nombre2 = document.getElementById('nombre2');
  const apellido1 = document.getElementById('apellido1');
  const apellido2 = document.getElementById('apellido2');
  const direccion = document.getElementById('direccion');
  const sexo = document.getElementById('sexo');
  const telefono = document.getElementById('telefono');
  const correo = document.getElementById('correo');

  if (!cedula || !inss || !nombre1 || !nombre2 || !apellido1 || !apellido2 || !direccion || !sexo || !telefono || !correo) {
    alert("Error al leer los campos del formulario.");
    return;
  }

  const data = {
    numero_cedula: cedula.value.trim(),
    numero_inss: inss.value.trim(),
    primer_nombre: nombre1.value.trim(),
    segundo_nombre: nombre2.value.trim(),
    primer_apellido: apellido1.value.trim(),
    segundo_apellido: apellido2.value.trim(),
    direccion: direccion.value.trim(),
    sexo: sexo.value,
    telefono: telefono.value.trim(),
    email: correo.value.trim(),
    estado: true
  };

  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/empleado/', {
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
      alert("Empleado registrado con éxito");
      document.getElementById('formEmpleado').reset();
      closeModal(); //cerrar el modal
      cargarEmpleados(); //recargar la tabla
    } else {
      alert(result.Message || "No se pudo registrar el empleado.");
    }
  } catch (error) {
    console.error("Error al registrar empleado:", error);
    alert("Ocurrió un error al conectar con el servidor.");
  }
}

//LLEMAR LA TABLA
document.addEventListener('DOMContentLoaded', () => {
  cargarEmpleados(); // al cargar la página
});

async function cargarEmpleados() {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/empleado/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success) {
      mostrarEmpleadosEnTabla(result.Record);
    } else {
      alert(result.Message || "No se pudieron obtener los empleados.");
    }

  } catch (error) {
    console.error("Error al cargar empleados:", error);
    alert("Error de conexión al cargar empleados.");
  }
}

function mostrarEmpleadosEnTabla(empleados) {
  const tbody = document.querySelector('.department__table tbody');
  tbody.innerHTML = ''; // limpia la tabla

  empleados.forEach(emp => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${emp.numero_cedula}</td>
      <td>${emp.numero_inss}</td>
      <td>${emp.primer_nombre}</td>
      <td>${emp.segundo_nombre}</td>
      <td>${emp.primer_apellido}</td>
      <td>${emp.segundo_apellido}</td>
      <td>${emp.direccion}</td>
      <td>${emp.sexo}</td>
      <td>${emp.telefono}</td>
      <td>${emp.email}</td>
      <td><button class="btn btn-sm btn-warning btn-editar-empleado">Editar</button></td>
      <td><button class="btn btn-sm btn-danger btn-eliminar-empleado">Eliminar</button></td>`;

    tbody.appendChild(fila);
  });
}

//buscar empleado por cédula
const btnBuscar = document.getElementById('btnBuscarEmpleado');
  if (btnBuscar) {
    btnBuscar.addEventListener('click', buscarEmpleado);
  };

async function buscarEmpleado() {
  const inputBuscar = document.getElementById('inputBuscarCedula');
  const cedula = inputBuscar.value.trim();

  if (!cedula) {
    alert("Por favor, ingresa una cédula.");
    return;
  }

  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch(`http://127.0.0.1:8000/adminrh/empleado/?numero_cedula=${cedula}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success && result.Record.length > 0) {
      const empleado = result.Record[0];
      mostrarEmpleadoSoloLectura(empleado);
    } else {
      alert(result.Message || "Empleado no encontrado.");
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    alert("Ocurrió un error al buscar el empleado.");
  }
}

function mostrarEmpleadoSoloLectura(empleado) {
  document.getElementById('cedula').value = empleado.numero_cedula;
  document.getElementById('inss').value = empleado.numero_inss;
  document.getElementById('nombre1').value = empleado.primer_nombre;
  document.getElementById('nombre2').value = empleado.segundo_nombre;
  document.getElementById('apellido1').value = empleado.primer_apellido;
  document.getElementById('apellido2').value = empleado.segundo_apellido;
  document.getElementById('direccion').value = empleado.direccion;
  document.getElementById('sexo').value = empleado.sexo;
  document.getElementById('telefono').value = empleado.telefono;
  document.getElementById('correo').value = empleado.email;

  // Deshabilitar todos los inputs del formulario
  document.querySelectorAll('#formEmpleado input, #formEmpleado select, #btnGuardarEmpleado')
    .forEach(elem => {
      elem.disabled = true;
    });

  openModal();
}

//al cerrar el modal, volver a activar los campos
function closeModal() {
  const modal = document.querySelector('.modal');
  modal.classList.remove('isactive');
  limpiarFormulario();
  document.querySelectorAll('#formEmpleado input, #formEmpleado select, #btnGuardarEmpleado')
    .forEach(elem => {
      elem.disabled = false;
    });
}

//EDITAR EMPLEADOS POR CEDULA
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('btn-editar-empleado')) {
    const fila = event.target.closest('tr');
    const celdas = fila.querySelectorAll('td');

    document.getElementById('cedula').value = celdas[0].textContent.trim();
    document.getElementById('inss').value = celdas[1].textContent.trim();
    document.getElementById('nombre1').value = celdas[2].textContent.trim();
    document.getElementById('nombre2').value = celdas[3].textContent.trim();
    document.getElementById('apellido1').value = celdas[4].textContent.trim();
    document.getElementById('apellido2').value = celdas[5].textContent.trim();
    document.getElementById('direccion').value = celdas[6].textContent.trim();
    document.getElementById('sexo').value = celdas[7].textContent.trim();
    document.getElementById('telefono').value = celdas[8].textContent.trim();
    document.getElementById('correo').value = celdas[9].textContent.trim();

    document.getElementById('cedula').disabled = true;
    document.getElementById('btnGuardarEmpleado').dataset.editando = "true";

    openModal();
  }
});

document.getElementById('btnGuardarEmpleado').addEventListener('click', async function () {
  const editando = this.dataset.editando === "true";

  const cedula = document.getElementById('cedula').value.trim();
  const data = {
    numero_cedula: cedula,
    numero_inss: document.getElementById('inss').value.trim(),
    primer_nombre: document.getElementById('nombre1').value.trim(),
    segundo_nombre: document.getElementById('nombre2').value.trim(),
    primer_apellido: document.getElementById('apellido1').value.trim(),
    segundo_apellido: document.getElementById('apellido2').value.trim(),
    direccion: document.getElementById('direccion').value.trim(),
    sexo: document.getElementById('sexo').value,
    telefono: document.getElementById('telefono').value.trim(),
    email: document.getElementById('correo').value.trim(),
  };

  const accessToken = localStorage.getItem('access_token');

  if (editando) {
    try {
      const response = await fetch('http://127.0.0.1:8000/adminrh/empleado/actualizar-empleado-cedula/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.Success) {
        alert("Empleado actualizado correctamente.");
        closeModal();
        cargarEmpleados();
      } else {
        alert(result.Message || "No se pudo actualizar el empleado.");
      }
    } catch (error) {
      console.error("Error en la actualización:", error);
      alert("Ocurrió un error al actualizar.");
    }
  } else {
    guardarEmpleado(); // usar la función normal para nuevo
  }

  this.dataset.editando = "false";
});
//ELIMINAR EMPLEADOS
function confirmarYEliminarEmpleado(cedula) {
  const seguro = confirm("¿Está seguro de eliminar este registro?");
  if (!seguro) return; //sale sin hacer nada

  const accessToken = localStorage.getItem('access_token');

  fetch('http://127.0.0.1:8000/adminrh/empleado/eliminar-cedula/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ numero_cedula: cedula })
  })
  .then(response => response.json())
  .then(result => {
    if (result.Success) {
      alert("Empleado eliminado correctamente.");
      cargarEmpleados();
    } else {
      alert(result.Message || "No se pudo eliminar el empleado.");
    }
  })
  .catch(error => {
    console.error("Error al eliminar empleado:", error);
    alert("Error al conectar con el servidor.");
  });
}

// Listener para botón eliminar
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn-eliminar-empleado')) {
    const fila = event.target.closest('tr');
    const cedula = fila.querySelector('td').textContent.trim();
    confirmarYEliminarEmpleado(cedula);
  }
});
