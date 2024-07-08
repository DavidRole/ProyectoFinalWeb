document.addEventListener('DOMContentLoaded', () => {
    const doctorId = new URLSearchParams(window.location.search).get('doctorId');
    const appointmentsTbody = document.getElementById('appointments-tbody');
    const bt_CancelAll = document.getElementById('cancelAll');

    executeRequest('get', `http://127.0.0.1:3000/api/appointments/doctor/${doctorId}`, (appointments) => {
        console.log(doctorId)
        if (appointments) {
            appointments.forEach(appointment => {
                executeRequest('get', `http://127.0.0.1:3000/api/patients/${appointment.patient}`, (patient) => {
                    const row = document.createElement('tr');
                    row.innerHTML = ` 
                    <td>${patient.name}</td>
                    <td>${patient.number}</td>
                    <td>${appointment.hour}</td>
                    <td style="background-color: ${appointment.state === 'active' ? 'green' : 'red'}">${appointment.state}</td>
                    <td><button class="buttons" data-appointment-id="${patient.id}" onclick="cancelAppointment(${doctorId},${patient.id})">Cancelar</button></td>
                    `;
                    appointmentsTbody.appendChild(row);
                });
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `No hay datos para cargar`;
            appointmentsTbody.appendChild(row);
        }
    }, () => {
        const row = document.createElement('tr');
        row.innerHTML = `No hay datos para cargar`;
        appointmentsTbody.appendChild(row);
    });

    bt_CancelAll.onclick = () => {
        executeRequest('delete', `http://127.0.0.1:3000/api/appointments/${doctorId}`, () => {
            window.alert("Todas las citas han sido canceladas");
            window.location.href = window.location.href;
        }, handleError);
    };
});

function cancelAppointment(doctorId,patientId) {
    executeRequest('delete', `http://127.0.0.1:3000/api/appointments/${doctorId}/${patientId}`, () => {
        const row = document.querySelector(`[data-appointment-id="${patientId}"]`).parentNode.parentNode;
        window.location.href = window.location.href;
    }, handleError);
}

function handleOk() {
    window.alert("Cita cancelada");
}

function handleError() {
    alert('No se pudo realizar la acción');
}


function executeRequest(method, url, handleOk, handleError, data, context) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
        console.log(xhr.status);

        if (xhr.status >= 200 && xhr.status <= 299) {
            const response = xhr.response;

            if (context) {
                handleOk({ ...response, ...context });
            } else {
                handleOk(response);
            }
        } else {
            handleError(`Error: ${xhr.status}, ${xhr.response}`);
        }
    });

    xhr.addEventListener('error', () => {
        handleError(`Error: ${xhr.status}, no se encontro el recurso`);
    });

    if (data) {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(data);
    } else {
        xhr.send();
    }
}