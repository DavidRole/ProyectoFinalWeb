// Recuperar el div#list
const divList = document.getElementById('list')

// Crear función executeRequest
// method: get, post...
// url: dirección donde está el servicio
// handleOk: función por ejecutar si la respuesta del request fue ok (200)
// handleError: función por ejecutar si la respuesta del request fue erronea (400, 404...)
// data: información que se envía en el body
// context: manipular elementos de la página (ejemplo eliminar un curso)
function executeRequest(method, url, handleOk, handleError, data, context) {
    // Crear un objeto XMLHttpRequest
    const xhr = new XMLHttpRequest()
    // Abrir la función con el método y url
    xhr.open(method, url)
    // Definir la respuesta del XHR (JSON)
    xhr.responseType = 'json'

    // Se agrega un evento, load => carga la respuesta
    xhr.addEventListener('load', () => {
        // Escribir el estado en la consola
        console.log(xhr.status)
        // Verificar si la respuesta fue aprobada 200
        if (xhr.status >= 200 && xhr.status <= 299) {
            // Interpreta la respuesta del evento
            const response = xhr.response
            // Si hay contexto lo maneja (se usa en el delete)
            if (context) {
                // Generar un nuevo objeto
                handleOk({ ...response, ...context })
            } else {
                // Se invoca la función para interpretar la respuesta aprobada
                handleOk(response)
            }
        } else {
            // Si hay error envía el detalle
            handleError(`Error: ${xhr.status}, ${xhr.response}`)
        }
    })

    // Se agrega un evento, error => maneja el error
    xhr.addEventListener('error', () => {
        handleError(`Error: ${xhr.status}, no se encontró el recurso`)
    })

    // Llamar al método de envío del request
    if (data) {
        // Establecer el encabezado tipo json
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
        // Enviar la data en el send
        xhr.send(data)
    } else {
        xhr.send()
    }
}

// Crear función showDoctors
// Recibe el array de doctor
function showDoctors(doctors) {
    // Crear un fragmento
    const fragment = document.createDocumentFragment()
    // Se recibe un array que se recorre con un forEach
    doctors.forEach(doctor => {
        // Crear un contenedor de tipo artículo
        const doctorElement = document.createElement('article')
        // Asignar la propiedad id del curso
        doctorElement.dataset.id = doctor.id
        // Modificar el contenido del article
        doctorElement.innerHTML = `
            <h3>${doctor.name}</h3>
            <button class="detail">Ver detalles</button>
        `
        // Agregar el artículo dentro del fragmento
        fragment.appendChild(doctorElement)
    })
    // Agregar el fragmento en el div#list
    divList.appendChild(fragment)
}

// Crear función showError
function showError(message) {
    divList.innerHTML = message
}

// Agregar el redireccionamiento para un nuevo curso
document.getElementById('Detail').onclick = () => {
    location.href = 'DoctorDetails.html'
}

// Agregar evento click en el div#courses
        // 'click', e objeto evento
        divList.addEventListener('click', e => {
            // Preguntar si el evento se dio en un botón (button)
            if (e.target.nodeName === 'BUTTON') {
                // Obtener id del article
                const id = e.target.parentNode.dataset.id
                // Preguntar si es un botón de borrar (verifica la clase borrar)
                if (e.target.classList.contains('detail')) {
                    // Cargar una nueva página
                    location.href = `DoctorDetails.html?id=${id}`
                }
            }
        })

// Invocar la función get de cursos al cargar la página
// Utiliza el evento DOMContentLoaded del document
document.addEventListener('DOMContentLoaded', () => {
    // Se llama a la función executeRequest con 'get', 'url', showDoctors, showError
    executeRequest(
        'get',
        'http://127.0.0.1:3000/api/doctors',
        showDoctors,
        showError
    )
})
