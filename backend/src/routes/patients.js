// Importar el módulo expres mediante un enrutador Router
const { throws } = require('assert')
const fs = require('fs')
const path = require('path')
const { domainToASCII } = require('url')
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
let patients = fs.readFile('./routes/patients.json', "utf-8", (error, data) =>{
  if(error){
      console.log("Error leyendo el archivo:", error);
      return;
  }
  const jsonArray = JSON.parse(data);
  patients = jsonArray;
});

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
    console.log(req.url);
    const index = patients.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
      const patient = patients[index];
      console.log(patient);
      resp.send(patient);
    } else {
      // el retorno en caso de que no se encuentre el pacinte solicitado
      resp.status(404).send(`No se encontró el paciente con el id ${req.params.id}`);
    }
  });

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