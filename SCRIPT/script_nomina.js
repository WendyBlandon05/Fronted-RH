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
