// Importar el módulo expres mediante un enrutador Router
const { Router } = require('express')
const router = Router()

// Importar el módulo joi
const Joi = require('joi')

// Exportar los métodos del servidor express (GET, GET/:i, POST, PUT, DELETE)
module.exports = router

// Importar un clase
const utilities = require('./utilities')

// Estructura de almacenamiento
// appointment (employeeId (int), date (String), patient (int), hour (String), state (String))
const appointments = [
    {
        employeeId: 1,
        date: "2024-06-17",
        patient: 204850655,
        hour: "08:00",
        state: "active",
    },
    {
        employeeId: 1,
        date: "2024-06-18",
        patient: 204850655,
        hour: "10:00",
        state: "canceled",
    },
]

// Crear el método 'get' del directorio '/api/appointments' (recuperar todos las citas)
router.get('/', (req, resp) => {
    console.log(req.url)
    //leer 
    // Envía el array appointments 
    resp.send(appointments)
})

// Crear el método 'get' del directorio '/api/appointments' pero solo un elemento
// Se envían parámetros, para ello se envía el atributo en la url, con : y nombre (:id)
// /api/appointments/:id
router.get('/:id', (req, resp) => {
    console.log(req.url);
    const index = appointments.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
      const appointment = appointments[index];
      console.log(appointment);
      resp.send(appointment);
    } else {
      // el retorno en caso de que no se encuentre la cita solicitada
      resp.status(404).send(`No se encontró la cita con el id ${req.params.id}`);
    }
  });

// Crear el método 'post' para el directorio '/api/appointments'
// La información se recibe en el body
router.post('/', (req, resp) => {
    // Validar que el nombre esté presente y sea de almenos 3 caracteres
    // if (!req.body.name || req.body.name.length < 3) {
    //     return resp.status(400).send('El nombre del curso debe ser de al menos 3 caracteres')
    // }

    // Crear un esquema de validación (Joi.object)
    // Definir reglas para cada campo
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        date: Joi.string().min(3).required(), 
        patient: Joi.string().min(3).required(),
        state: Joi.string().min(3).required()

    })

    // Llama al método de validar la información (validate)
    const { error } = schema.validate(req.body)

    console.log(error)

    // Si hay un error debe retornar el error 400
    if (error) return resp.status(400).send(error.details[0].message)

    // Se crea el objeto curso
    const appointment = {
        //id: courses.length + 1, // autoincremental
        id: utilities.increase(appointments.length),
        name: req.body.name
    }

    // Se agrega el curso al array
    appointments.push(course)
    //lea el array y lo convierta en json

    // Se responde el curso
    resp.send(appointment)
})

// Crear el método 'delete' del directorio '/api/appointments'
// Elimina un elemento recibido por parámetros
router.delete('/:id', (req, resp) => {
    // Buscar la cita
    const appointment = appointments.find(c => c.id === parseInt(req.params.id))
    if (!appointment) return resp.status(404).send(`No se encontró la cita con el id ${req.params.id}`)

    // Eliminar la cita del array
    const index = appointments.indexOf(course)
    appointments.splice(index, 1) // Elimina elementos desde el índice señalado
    resp.send(appointment)
})

// Función de validar información
function validar(appointment) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(course)
}