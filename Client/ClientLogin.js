document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login');
    const input = document.getElementById('text');


    loginButton.onclick = () => {
        const patientId = input.value

        executeRequest('get', `http://127.0.0.1:3000/api/patients/${patientId}`, (patient) => {
            alert('Sesión iniciada con éxito')
            window.location.href = `HomeWindow.html?patientId=${patientId}`;
        },
           () => {alert(`El usuario cedula ${patientId}, no se encuentra`)}
        );
    };
});

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