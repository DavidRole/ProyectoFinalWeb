document.addEventListener('DOMContentLoaded', () => {
    const patientId = new URLSearchParams(window.location.search).get('patientId');
    const links = document.querySelectorAll('.menulinks a');
    const selectDoctor = document.getElementById('list');
    const scheduleBt = document.getElementById('schedule');
    const dateInput = document.getElementById('date');
    const currentDate = new Date();
    const minDateISO = currentDate.toISOString().substring(0, 10);

    dateInput.min = minDateISO;

    links.forEach(link => {
        const url = new URL(link.href); // Create a URL object from the existing href
        url.searchParams.set('patientId', patientId); // Add patientId as a query parameter
        link.href = url.toString(); // Update the link's href with the modified URL
    });

    executeRequest('get', 'http://127.0.0.1:3000/api/doctors/', (doctors) => {
        console.log('Doctors:', doctors);
        fillDoctorSelect(doctors);
    });

    function fillDoctorSelect(doctors) {
        console.log('Populating doctor select...');
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.text = `Dr. ${doctor.name} ${doctor.speciality}`;
            selectDoctor.appendChild(option);
        });
    }
});



// scheduleBt.addEventListener('click', function () {
//     const selectedDoctorId = selectDoctor.value;
//     if (selectedDoctorId !== 'default') {
//         console.log(`Selected doctor ID: ${selectedDoctorId}`);
//         window.location.href = `DoctorDetails.html?doctorId=${selectedDoctorId}`;
//     } else {
//         console.error('No doctor selected');
//     }
// });

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