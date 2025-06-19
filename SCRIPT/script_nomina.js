document.addEventListener('DOMContentLoaded', () => {
    cargarNominas();
});

async function cargarNominas() {
    const accessToken = localStorage.getItem('access_token');
    const tbody = document.querySelector('.department__table tbody');
    tbody.innerHTML = ''; 
    try {
        const response = await fetch('http://127.0.0.1:8000/adminrh/nomina/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const result = await response.json();

        if (response.ok && result.Success) {
            result.Record.forEach(nomina => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${nomina.nombre_empresa}</td>
                    <td>${nomina.mes_pagado}</td>
                    <td>${nomina.estado}</td>
                    <td>${nomina.fecha_pago}</td>
                    <td>${nomina.total_beneficios || 'C$ 0.00'}</td>
                    <td>${nomina.total_deducciones || 'C$ 0.00'}</td>
                    <td>${nomina.salario_bruto || 'C$ 0.00'}</td>
                    <td>${nomina.total_pagar || 'C$ 0.00'}</td>
                    <td><button class="btn btn-warning btn-sm">Editar</button></td>
                    <td><button class="btn btn-danger btn-sm">Eliminar</button></td>
                `;
                tbody.appendChild(fila);
            });
        } else {
            alert(result.Message || "No se encontraron registros de nómina.");
        }
    } catch (error) {
        console.error("Error al cargar las nóminas:", error);
        alert("Error de conexión al cargar las nóminas.");
    }
}
/////////////
async function generarNomina() {
  const nombre_empresa = prompt("Ingrese el nombre de la empresa:");
  const mes_pagado = prompt("Ingrese el mes a pagar (Ej: 'Enero 2025'):");
  const estado = prompt("Ingrese el estado: 'PAGADA' o 'PENDIENTE':");
  const fecha_pago = prompt("Ingrese la fecha de pago (YYYY-MM-DD):");

  if (!nombre_empresa || !mes_pagado || !estado || !fecha_pago) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/nomina/calculo-nomina/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        nombre_empresa,
        mes_pagado,
        estado,
        fecha_pago
      })
    });

    const result = await response.json();

    if (response.ok && result.length > 0) {
      const nomina = result[0];

      document.getElementById('empresa').value = nomina.nombre_empresa;
      document.getElementById('mes_pagado').value = nomina.mes_pagado;
      document.getElementById('estado').value = nomina.estado;
      document.getElementById('fecha_pago').value = nomina.fecha_pago;
      document.getElementById('beneficios').value = nomina.total_beneficios;
      document.getElementById('deducciones').value = nomina.total_deducciones;
      document.getElementById('salario').value = nomina.salario_bruto;
      document.getElementById('total_pagar').value = nomina.total_pagar;

      // Deshabilitar campos
      document.querySelectorAll('#formNomina input, #formNomina select').forEach(input => {
        input.disabled = true;
      });
      document.getElementById('btnGuardarNomina').disabled = false;

      openModal();
    } else {
      alert("No se pudo calcular la nómina. Verifique los datos.");
    }
  } catch (error) {
    console.error("Error al calcular nómina:", error);
    alert("Ocurrió un error al conectar con el servidor.");
  }
}
///////////////
// modal con el form limpio
function openModal() {
  const modal = document.querySelector('.modal');
  modal.classList.add('isactive');
  limpiarFormulario();
  // habilitar
  ['empresa','mes_pagado','estado','fecha_pago','beneficios','deducciones','salario','total_pagar'].forEach(id => {
    const el = document.getElementById(id);
    el.disabled = false;
  });
  // aun no se calculo
  document.getElementById('btnGuardarNomina').dataset.ready = "false";
}


function closeModal() {
  const modal = document.querySelector('.modal');
  modal.classList.remove('isactive');
  limpiarFormulario();
}

// lipiar formulario
function limpiarFormulario() {
  document.getElementById('formNomina').reset();
}

// fecha de pago
function obtenerFechaPago(mesPagado) {
  return mesPagado + '-30';
}

// Validar y calcular nómina
async function generarNomina() {
  const empresa = document.getElementById('empresa').value.trim();
  const mesPagado = document.getElementById('mes_pagado').value.trim();

  if (!empresa) {
    alert('Por favor ingrese el nombre de la empresa.');
    return false;
  }
  if (!mesPagado) {
    alert('Por favor ingrese el mes pagado (YYYY-MM).');
    return false;
  }

  const estado = 'PENDIENTE';
  const fecha_pago = obtenerFechaPago(mesPagado);

  const data = {
    nombre_empresa: empresa,
    mes_pagado: mesPagado,
    estado,
    fecha_pago
  };

  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/nomina/calculo-nomina/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.Message || 'Error al calcular la nómina.');
      return false;
    }

    const resultados = await response.json();

    if (!resultados.length) {
      alert('No se obtuvieron resultados de la nómina.');
      return false;
    }

    const nomina = resultados[0];

    //llenar campos con datos calculados
    document.getElementById('empresa').value = nomina.nombre_empresa;
    document.getElementById('mes_pagado').value = nomina.mes_pagado;
    document.getElementById('estado').value = nomina.estado;
    document.getElementById('fecha_pago').value = nomina.fecha_pago;
    document.getElementById('beneficios').value = nomina.total_beneficios;
    document.getElementById('deducciones').value = nomina.total_deducciones;
    document.getElementById('salario').value = nomina.salario_bruto;
    document.getElementById('total_pagar').value = nomina.total_pagar;

    // Bloquear todos los campos
    ['empresa','mes_pagado','estado','fecha_pago','beneficios','deducciones','salario','total_pagar'].forEach(id => {
      document.getElementById(id).disabled = true;
    });

    document.getElementById('btnGuardarNomina').dataset.ready = "true";
    alert('Nómina calculada correctamente, ahora puede guardarla.');

    return true;

  } catch (error) {
    console.error('Error en cálculo nómina:', error);
    alert('Ocurrió un error al calcular la nómina.');
    return false;
  }
}

// Guardar nómina en base de datos
async function guardarNomina() {
  const data = {
    nombre_empresa: document.getElementById('empresa').value,
    mes_pagado: document.getElementById('mes_pagado').value,
    estado: document.getElementById('estado').value,
    fecha_pago: document.getElementById('fecha_pago').value,
    total_beneficios: parseFloat(document.getElementById('beneficios').value),
    total_deducciones: parseFloat(document.getElementById('deducciones').value),
    salario_bruto: parseFloat(document.getElementById('salario').value),
    total_pagar: parseFloat(document.getElementById('total_pagar').value)
  };

  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/nomina/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.Success) {
      alert('Nómina guardada con éxito.');
      closeModal();
      cargarNominas(); //recargar tabal
    } else {
      alert(result.Message || 'No se pudo guardar la nómina.');
    }
  } catch (error) {
    console.error('Error al guardar nómina:', error);
    alert('Ocurrió un error al guardar la nómina.');
  }
}

// Evento para botón calcula o guarda 
document.getElementById('btnGuardarNomina').addEventListener('click', async () => {
  const btn = document.getElementById('btnGuardarNomina');
  if (btn.dataset.ready === "true") {
    guardarNomina();
  } else {
    await generarNomina();
  }
});

// Evento para abrir modal
document.getElementById('new').addEventListener('click', openModal);
