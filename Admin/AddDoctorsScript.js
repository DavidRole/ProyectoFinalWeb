document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addButton');
    const doctorNameInput = document.getElementById('nameBox');
    const doctorSpecialitySelect = document.getElementById('list');

    addButton.onclick = () => {
        const doctorName = doctorNameInput.value.trim();
        const doctorSpeciality = doctorSpecialitySelect.value;

        if (doctorName === '') {
            alert('Por favor, ingrese el nombre del doctor.');
            return;
        }

        if (doctorSpeciality === 'default') {
            alert('Por favor, seleccione una especialidad.');
            return;
        }

        // Enviar los datos como un objeto JSON
        const doctorData = JSON.stringify({
            name: doctorName,
            specialty: doctorSpeciality // Cambiado a "specialty"
        })

        executeRequest('post', 'http://127.0.0.1:3000/api/doctors/', handleOk, onerror, doctorData)
    }
});

function handleOk() {
        alert('El médico ha sido agregado exitosamente.');
        // Limpiar el formulario
        doctorNameInput.value = '';
        doctorSpecialitySelect.selectedIndex = 0;
    }

function onerror() {
        alert('Hubo un error de red. Por favor, intente nuevamente.')
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
