   const modal = document.querySelector('.modal');
    const tbody = document.querySelector('tbody');

    const campos = [
        'cedula', 'inss', 'nombre1', 'nombre2', 'apellido1', 'apellido2',
        'direccion', 'sexo', 'telefono', 'correo'
    ];

    const inputs = {};
    campos.forEach(campo => {
        inputs[campo] = document.getElementById(campo);
    });

    const btnGuardar = document.getElementById('btnGuardarEmpleado');

    let empleados = [];
    let id;

    function openModal(edit = false, index = 0) {
        modal.classList.add('isactive');

        modal.onclick = e => {
            if (e.target.classList.contains('modal')) {
                modal.classList.remove('isactive');
            }
        };

        if (edit) {
            campos.forEach(campo => {
                inputs[campo].value = empleados[index][campo];
            });
            id = index;
        } else {
            campos.forEach(campo => {
                inputs[campo].value = '';
            });
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
            <td>${empleado.cedula}</td>
            <td>${empleado.inss}</td>
            <td>${empleado.nombre1}</td>
            <td>${empleado.nombre2}</td>
            <td>${empleado.apellido1}</td>
            <td>${empleado.apellido2}</td>
            <td>${empleado.direccion}</td>
            <td>${empleado.sexo}</td>
            <td>${empleado.telefono}</td>
            <td>${empleado.correo}</td>
            <td class="department__action">
                <button onclick="editEmpleado(${index})"><i class="bx bx-edit"></i></button>
            </td>
            <td class="department__action">
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
            datos[campo] = inputs[campo].value.trim();
        }

        if (id !== undefined) {
            empleados[id] = datos;
        } else {
            empleados.push(datos);
        }

        guardarEmpleados();
        modal.classList.remove('isactive');
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