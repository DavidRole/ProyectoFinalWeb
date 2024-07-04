document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.buttons');
    const doctorNameInput = document.querySelector('.input');
    const doctorSpecialitySelect = document.getElementById('list');

    addButton.addEventListener('click', function(event) {
        event.preventDefault();
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

        // Crear el objeto XHR
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://127.0.0.1:3000/api/doctors/', true); // URL del servidor donde se enviarán los datos
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Manejar la respuesta del servidor
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                alert('El médico ha sido agregado exitosamente.');
                // Limpiar el formulario
                doctorNameInput.value = '';
                doctorSpecialitySelect.selectedIndex = 0;
            } else {
                alert('Hubo un error al agregar el médico. Por favor, intente nuevamente.');
            }
        };

        // Manejar errores de la petición
        xhr.onerror = function() {
            alert('Hubo un error de red. Por favor, intente nuevamente.');
        };

        // Enviar los datos como un objeto JSON
        const doctorData = JSON.stringify({
            name: doctorName,
            specialty: doctorSpeciality // Cambiado a "specialty"
        });
        xhr.send(doctorData);
    });
});
