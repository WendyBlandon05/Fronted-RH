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
  document.getElementById('formJornada').reset();
}


//Guardar Jornada

async function guardarJornada() {
  const jornada = document.getElementById('jorna');
  const horas = document.getElementById('horas');
  const descrip = document.getElementById('descripcion');

  if (!jornada || !horas || !descrip) {
    alert("Error al leer los campos del formulario.");
    return;
  }

  const nombre = jornada.value.trim();
  const cantidad = parseInt(horas.value.trim());
  const descripcion = descrip.value.trim();

  if (nombre.length < 4) {
    alert("El nombre de la jornada debe tener al menos 4 caracteres.");
    return;
  }

  if (isNaN(cantidad) || cantidad < 90 || cantidad > 300) {
    alert("La cantidad de horas debe estar entre 91 y 300.");
    return;
  }

  if (descripcion.length < 10) {
    alert("La descripción debe tener al menos 10 caracteres.");
    return;
  }

  const data = {
    nombre_jornada: nombre,
    cantidad_horas: cantidad,
    descripcion: descripcion
  };

  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/jornada/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log("Respuesta del servidor:", result);

    if (response.ok) {
      alert("Jornada registrada con éxito.");
      document.getElementById('formJornada').reset();
      closeModal();
      cargarJornadas();
    } else {
      if (typeof result === 'object') {
        let errores = '';
        for (const campo in result) {
          if (Array.isArray(result[campo])) {
            errores += `• ${campo}: ${result[campo].join(', ')}\n`;
          }
        }
        alert(`Error al registrar:\n${errores || "Error desconocido."}`);
      } else {
        alert(result.Message || "No se pudo registrar la jornada.");
      }
    }
  } catch (error) {
    console.error("Error al registrar la jornada:", error);
    alert("Ocurrió un error al conectar con el servidor.");
  }
}


//LLENAR LA TABLA
document.addEventListener('DOMContentLoaded', () => {
  cargarJornadas(); // al cargar la página
});

async function cargarJornadas() {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/jornada/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success) {
      mostrarJornadasEnTabla(result.Record);
    } else {
      alert(result.Message || "No se pudieron obtener las jornadas.");
    }

  } catch (error) {
    console.error("Error al cargar jornadas:", error);
    alert("Error de conexión al cargar jornadas.");
  }
}

function mostrarJornadasEnTabla(deptos) {
  const tbody = document.querySelector('.department__table tbody');
  tbody.innerHTML = ''; // limpia la tabla

  deptos.forEach(emp => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${emp.nombre_jornada}</td>
      <td>${emp.cantidad_horas}</td>
      <td>${emp.descripcion}</td>
      <td><button class="btn btn-sm btn-warning btn-editar-jornada">Editar</button></td>
      <td><button class="btn btn-sm btn-danger btn-eliminar-jornada">Eliminar</button></td>`;

    tbody.appendChild(fila);
  });
}
document.getElementById('btnGuardarJornadas').addEventListener('click', function(e) {
  e.preventDefault();
  guardarJornada();
});
