document.addEventListener('DOMContentLoaded', () => {
    const patientId = new URLSearchParams(window.location.search).get('patientId');
    const patientInfo = document.getElementById('info');
    const appointmentsTbody = document.getElementById('appointments-tbody');
    const links = document.querySelectorAll('.menulinks a'); 

    links.forEach(link => {
        const url = new URL(link.href); 
        url.searchParams.set('patientId', patientId); 
        link.href = url.toString(); 
    });
    
    executeRequest('get', `http://127.0.0.1:3000/api/patients/${patientId}`, (patient) => {
        if (patient) {
            const infoString = `
            Nombre: ${patient.name} <br>
            ID: ${patient.id} <br>
            Fecha de Nacimiento: ${patient.birthdate} <br>
            Teléfono: ${patient.phoneNumber}
          `;
            patientInfo.innerHTML = infoString;
        } else {
            patientInfo.innerHTML = 'No hay datos de paciente para cargar';
        }
    }, () => {
        patientInfo.innerHTML = 'Error: Conección caída, no se pudo cargar la información del paciente';
    });


    executeRequest('get', `http://127.0.0.1:3000/api/appointments/patient/${patientId}`, (appointments) => {
        console.log(patientId)
        if (appointments) {
            appointments.forEach(appointment => {
                executeRequest('get', `http://127.0.0.1:3000/api/doctors/${appointment.employeeId}`, (doctor) => {
                    const row = document.createElement('tr');
                    row.innerHTML = ` 
                    <td>${doctor.name}</td>
                    <td>${doctor.speciality}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.hour}</td>
                    <td style="background-color: ${appointment.state === 'active' ? 'green' : 'red'}">${appointment.state}</td>
                    <td><button class="buttons" data-appointment-id="${doctor.id}" onclick="cancelAppointment(${doctor.id},${patientId})">Cancelar</button></td>
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
});

function cancelAppointment(doctorId, patientId) {
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