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
// patient (id (int), name (String), birthdate (String), phone (String))
const patients = [
    {id: 207850965,
    name: 'Tomás Salas Quirós',
    birthdate: '1998-03-15',
    phone: '8945-4544'},

    {id: 110520366,
    name: 'Marcos Pérez Castro',
    birthdate: '2001-10-07',
    phone: '8477-6982'} ]

// Crear el método 'get' del directorio '/api/patients' (recuperar todos los pacientes)
router.get('/', (req, resp) => {
    console.log(req.url)
    // Envía el array patients
    resp.send(patients)
})

// Crear el método 'get' del directorio '/api/patients' pero solo un elemento
// Se envían parámetros, para ello se envía el atributo en la url, con : y nombre (:id)
// /api/patients/:id
router.get('/:id', (req, resp) => {
    console.log(req.url)
    // Debe obtener el parámetro de entrada req (req.params.id)
    // El parámetro se recibe como String y debe convertirse a int (parseInt)
    // Se busca con la función find del array
        // Pasa un objeto y al objeto le asignamos la propiedad id
    const patient = patients.find(c => c.id === parseInt(req.params.id))
    console.log(patient)
    // Si el cliente no existe retornamos el estado 404
    if (!patient) return resp.status(404).send(`El paciente con el id ${req.params.id} no existe`)
    // Retornar el cliente
    resp.send(patient)
})

// Crear el método 'put' del directorio '/api/patients/:id'
// Recibe id por parámetro
router.put('/:id', (req, resp) => {
    // Se busca el cliente en el array
    const patient = patients.find(c => c.id === parseInt(req.params.id))
    // Si no encuentra el cliente retorna 404
    if (!patient) return resp.status(404).send(`El paciente con el id ${req.params.id} no existe`)

    // Validar error llamando a un función 'validar'
    const { error } = validar(req.body)

    // Si hay error retorna el detalle
    if (error) return resp.status(400).send(error.details[0].message)

    // Si no hay error lo cambia
    patient.name = req.body.name
    resp.send(patient)
})

// Función de validar información
function validar(patient) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(patient)
}