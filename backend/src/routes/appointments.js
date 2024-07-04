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

// Crear el método 'get' del directorio '/api/courses' (recuperar todos los cursos)
router.get('/', (req, resp) => {
    console.log(req.url)
    //leer 
    // Envía el array courses
    resp.send(courses)
})

// Crear el método 'get' del directorio '/api/courses' pero solo un elemento
// Se envían parámetros, para ello se envía el atributo en la url, con : y nombre (:id)
// /api/courses/:id
router.get('/:id', (req, resp) => {
    console.log(req.url)
    // Debe obtener el parámetro de entrada req (req.params.id)
    // El parámetro se recibe como String y debe convertirse a int (parseInt)
    // Se busca con la función find del array
    // Pasa un objeto y al objeto le asignamos la propiedad id
    const course = courses.find(c => c.id === parseInt(req.params.id))
    console.log(course)
    // Si el curso no existe retornamos el estado 404
    if (!course) return resp.status(404).send(`El curso con el id ${req.params.id} no existe`)
    // Retornar el curso
    resp.send(course)
})

// Crear el método 'post' para el directorio '/api/courses'
// La información se recibe en el body
router.post('/', (req, resp) => {
    // Validar que el nombre esté presente y sea de almenos 3 caracteres
    // if (!req.body.name || req.body.name.length < 3) {
    //     return resp.status(400).send('El nombre del curso debe ser de al menos 3 caracteres')
    // }

    // Crear un esquema de validación (Joi.object)
    // Definir reglas para cada campo
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    // Llama al método de validar la información (validate)
    const { error } = schema.validate(req.body)

    console.log(error)

    // Si hay un error debe retornar el error 400
    if (error) return resp.status(400).send(error.details[0].message)

    // Se crea el objeto curso
    const course = {
        //id: courses.length + 1, // autoincremental
        id: utilities.increase(courses.length),
        name: req.body.name
    }

    // Se agrega el curso al array
    courses.push(course)
    //lea el array y lo convierta en json

    // Se responde el curso
    resp.send(course)
})

// Crear el método 'put' del directorio '/api/courses/:id'
// Recibe id por parámetro
router.put('/:id', (req, resp) => {
    // Se busca el curso en el array
    const course = courses.find(c => c.id === parseInt(req.params.id))
    // Si no encuentra el curso retorna 404
    if (!course) return resp.status(404).send(`El curso con el id ${req.params.id} no existe`)

    // Validar error llamando a un función 'validar'
    const { error } = validar(req.body)

    // Si hay error retorna el detalle
    if (error) return resp.status(400).send(error.details[0].message)

    // Si no hay error lo cambia
    course.name = req.body.name
    resp.send(course)
})

// Crear el método 'delete' del directorio '/api/courses'
// Elimina un elemento recibido por parámetros
router.delete('/:id', (req, resp) => {
    // Buscar el curso
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return resp.status(404).send(`No se encontró el curso con el id ${req.params.id}`)

    // Eliminar el curso del array
    const index = courses.indexOf(course)
    courses.splice(index, 1) // Elimina elementos desde el índice señalado
    resp.send(course)
})

// Función de validar información
function validar(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(course)
}