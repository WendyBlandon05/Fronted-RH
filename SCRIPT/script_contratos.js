// Abre el modal por ID
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('isactive');
  }
}

// Cierra el modal por ID
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('isactive');
    limpiarFormulario(modalId);
  }
}

// Limpia el formulario dentro del modal
function limpiarFormulario(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    const form = modal.querySelector('form');
    if (form) {
      form.reset();
    }
  }
}
//GUARDAR UN TIPO DE CONTRATO
async function guardarTipo() {
  const name = document.getElementById('name');

  if (!name) {
    alert("Error al leer los campos del formulario.");
    return;
  }
    const data = {
    nombre_tipo: name.value.trim()
  };

  const accessToken = localStorage.getItem('access_token');

    try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/tipo-contratos/', {
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
      alert("Tipo de contrato registrado con éxito");
      document.getElementById('formtipoContrato').reset();
      closeModal('modalTipoContrato'); //cerrar el modal
      cargarTipos(); //recargar la tabla
    } else {
      alert(result.Message || "No se pudo registrar el tipo de contrato.");
    }
  } catch (error) {
    console.error("Error al registrar el tipo de contrato:", error);
    alert("Ocurrió un error al conectar con el servidor.");
  }
}

//llenar la tabla
document.addEventListener('DOMContentLoaded', () => {
  cargarTipos(); // al cargar la página
});

async function cargarTipos() {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/tipo-contratos/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success) {
      mostrarTiposEnTabla(result.Record);
    } else {
      alert(result.Message || "No se pudieron obtener los tipos de contrato.");
    }

  } catch (error) {
    console.error("Error al cargar los tipos de contrato:", error);
    alert("Error de conexión al cargar los tipos de contratos.");
  }
}

//agregar a la tbla
function mostrarTiposEnTabla(tipos) {
  const tbody = document.querySelector('.department__table tbody');
  tbody.innerHTML = ''; // limpia la tabla

  tipos.forEach(tip => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${tip.nombre_tipo}</td>
      <td><button class="btn btn-sm btn-danger btn-eliminar-tipo">Eliminar</button></td>`;

    tbody.appendChild(fila);
  });
}
//capturar
document.getElementById("btnGuardarTipoContrato").addEventListener("click", function (e) {
    e.preventDefault(); // evita que el formulario recargue la página
    guardarTipo();
});

//Eliminar tipo
function confirmarYEliminarTipoContrato(nombreTipo) {
  const seguro = confirm(`¿Está seguro de eliminar el tipo de contrato "${nombreTipo}"?`);
  if (!seguro) return;

  const accessToken = localStorage.getItem('access_token');

  fetch('http://127.0.0.1:8000/adminrh/tipo-contratos/eliminar-nombre/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ nombre_tipo: nombreTipo })
  })
  .then(response => response.json())
  .then(result => {
    if (result.Success) {
      alert("Tipo de contrato eliminado correctamente.");
      cargarTipos(); // recarga la lista si tienes esa función
    } else {
      alert(result.Message || "No se pudo eliminar el tipo de contrato.");
    }
  })
  .catch(error => {
    console.error("Error al eliminar tipo de contrato:", error);
    alert("Error al conectar con el servidor.");
  });
}

// Listener para botón eliminar tipo contrato
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn-eliminar-tipo')) {
    const fila = event.target.closest('tr');
    const nombreTipo = fila.querySelector('td').textContent.trim();
    confirmarYEliminarTipoContrato(nombreTipo);
  }
});

////////

document.addEventListener("DOMContentLoaded", function () {
    cargarTiposContrato();
    cargarJornadas(); 
    cargarCargos();
    cargarDepartamentos()
});

// Función para cargar el select de tipo de contrato
function cargarTiposContrato() {
    const selectTipo = document.getElementById("tipo");
    const accessToken = localStorage.getItem("access_token"); // Solo si usas token

    fetch("http://127.0.0.1:8000/adminrh/tipo-contratos/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.Success) {
            data.Record.forEach(item => {
                const option = document.createElement("option");
                option.value = item.id; // Solo guardarás el ID
                option.textContent = item.nombre_tipo;
                selectTipo.appendChild(option);
            });
        } else {
            alert("No se pudo cargar la lista de tipos de contrato.");
        }
    })
    .catch(error => {
        console.error("Error al cargar tipos de contrato:", error);
    });
}
//select de jornadas
function cargarJornadas() {
    const selectJornada = document.getElementById("jornada");
    const accessToken = localStorage.getItem("access_token"); // Si usas autenticación

    fetch("http://127.0.0.1:8000/adminrh/jornada/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.Success) {
            data.Record.forEach(item => {
                const option = document.createElement("option");
                option.value = item.id; // Guardarás solo el ID
                option.textContent = item.nombre_jornada;
                selectJornada.appendChild(option);
            });
        } else {
            alert("No se pudo cargar la lista de jornadas.");
        }
    })
    .catch(error => {
        console.error("Error al cargar jornadas:", error);
    });
}
//select de cargos
function cargarCargos() {
    const selectCargo = document.getElementById("cargo");
    const accessToken = localStorage.getItem("access_token"); // Si usas autenticación

    fetch("http://127.0.0.1:8000/adminrh/cargos/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.Success) {
            data.Record.forEach(item => {
                const option = document.createElement("option");
                option.value = item.id; // Guardamos el ID
                option.textContent = item.nombre_cargo;
                selectCargo.appendChild(option);
            });
        } else {
            alert("No se pudo cargar la lista de cargos.");
        }
    })
    .catch(error => {
        console.error("Error al cargar cargos:", error);
    });
}
//funcion para cargar departamentos
function cargarDepartamentos() {
    const selectDepartamento = document.getElementById("departamento");
    const accessToken = localStorage.getItem("access_token"); // Si usas autenticación

    fetch("http://127.0.0.1:8000/adminrh/departamentos/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.Success) {
            data.Record.forEach(item => {
                const option = document.createElement("option");
                option.value = item.id; // Se guarda el ID
                option.textContent = item.nombre_departamento;
                selectDepartamento.appendChild(option);
            });
        } else {
            alert("No se pudo cargar la lista de departamentos.");
        }
    })
    .catch(error => {
        console.error("Error al cargar departamentos:", error);
    });
}
