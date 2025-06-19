document.addEventListener("DOMContentLoaded", () => {
 const generoChart = new Chart(document.getElementById("generoChart"), {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#36A2EB', '#FF6384' ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: context => {
              const value = context.parsed;
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const pct = total ? ((value / total) * 100).toFixed(2) : 0;
              return `${context.label}: ${value} (${pct}%)`;
            }
          }
        }
      }
    }
  });

  const contratoChart = new Chart(document.getElementById("contratoChart"), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Cantidad',
        data: [],
        backgroundColor: '#4BC0C0'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const jornadaChart = new Chart(document.getElementById("jornadaChart"), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Cantidad',
        data: [],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const departamentoChart = new Chart(document.getElementById("departamentoChart"), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Personal',
        data: [],
        backgroundColor: '#9966FF'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  //llamar funciones al iniciar lapagina
  mostrarGraficoGenero(generoChart);
  mostrarCantidadEmpleados();
  mostrarCantidadContratos();
  mostrarCantidadDepartamentos();
  mostrarGraficoJornada(jornadaChart);
  mostrarGraficoDepartamento(departamentoChart);
  mostrarNominaMes();



});

async function mostrarCantidadEmpleados() {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/empleado/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success && Array.isArray(result.Record)) {
      const total = result.Record.length;
      document.getElementById('totalEmpleados').textContent = total;
    } else {
      document.getElementById('totalEmpleados').textContent = '0';
    }

  } catch (error) {
    console.error("Error al obtener cantidad de empleados:", error);
    document.getElementById('totalEmpleados').textContent = 'Error';
  }
}
//MOSTRAR CONTRATOS
async function mostrarCantidadContratos() {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/contratos/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success && Array.isArray(result.Record)) {
      const total = result.Record.length;
      document.getElementById('totalContratos').textContent = total;
    } else {
      document.getElementById('totalContratos').textContent = '0';
    }

  } catch (error) {
    console.error("Error al obtener cantidad de Contratos:", error);
    document.getElementById('totalContratos').textContent = 'Error';
  }
}
//MOSTRAR departamentos
async function mostrarCantidadDepartamentos() {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/departamentos/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success && Array.isArray(result.Record)) {
      const total = result.Record.length;
      document.getElementById('totalDepartamentos').textContent = total;
    } else {
      document.getElementById('totalDepartamentos').textContent = '0';
    }

  } catch (error) {
    console.error("Error al obtener cantidad de departamentos:", error);
    document.getElementById('totalDepartamentos').textContent = 'Error';
  }
}
//MOSTRAR MUJERES
async function mostrarGraficoGenero(generoChart) {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/empleado/conteo-genero/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result && typeof result.hombres === 'number' && typeof result.mujeres === 'number') {
      const hombres = result.hombres;
      const mujeres = result.mujeres;

      generoChart.data.labels = ['Hombres', 'Mujeres'];
      generoChart.data.datasets[0].data = [hombres, mujeres];
      generoChart.update();
    } else {
      console.warn("Formato de respuesta inesperado:", result);
    }

  } catch (error) {
    console.error("Error al obtener datos de género:", error);
  }
}
//llenar las jornada 
async function mostrarGraficoJornada(jornadaChart) {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/jornada/conteo-contratos/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && Array.isArray(result)) {
      const etiquetas = result.map(item => item.jornada);
      const cantidades = result.map(item => item.cantidad);

      jornadaChart.data.labels = etiquetas;
      jornadaChart.data.datasets[0].data = cantidades;
      jornadaChart.update();
    } else {
      console.warn("Respuesta inesperada:", result);
    }

  } catch (error) {
    console.error("Error al cargar gráfico de jornada:", error);
  }
}
//LLENAR GRAFICO DEPARTAMENTOS 
async function mostrarGraficoDepartamento(departamentoChart) {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/departamentos/personal-por-departamento/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && Array.isArray(result)) {
      const etiquetas = result.map(item => item.departamento);
      const datos = result.map(item => item.personal);
      const colores = etiquetas.map(() => generarColorAleatorio());

      departamentoChart.data.labels = etiquetas;
      departamentoChart.data.datasets[0].data = datos;
      departamentoChart.data.datasets[0].backgroundColor = colores;

      departamentoChart.update();
    } else {
      console.warn("Respuesta inesperada:", result);
    }

  } catch (error) {
    console.error("Error al cargar gráfico de departamentos:", error);
  }
}
//GENERAR COLORCITOS
function generarColorAleatorio() {
  const r = Math.floor(Math.random() * 200) + 30;
  const g = Math.floor(Math.random() * 200) + 30;
  const b = Math.floor(Math.random() * 200) + 30;
  return `rgb(${r}, ${g}, ${b})`;
}
//mostrar proyeccion del mes
async function mostrarNominaMes() {
  const accessToken = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/adminrh/contratos/proyeccion-nomina-actual/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (response.ok && result.Success && result.Record) {
      const totalNomina = result.Record.total_proyectado || 0;
      document.getElementById('nominaMes').textContent = `$${totalNomina.toFixed(2)}`;
    } else {
      document.getElementById('nominaMes').textContent = '--';
    }

  } catch (error) {
    console.error("Error al obtener la nómina del mes:", error);
    document.getElementById('nominaMes').textContent = 'Error';
  }
}

