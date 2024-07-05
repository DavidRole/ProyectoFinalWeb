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
// doctor(employeeId (int), name (String), specialty (String))
let doctors = [];
fs.readFile('./routes/doctors.json', "utf-8", (error, data) =>{
    if(error){
        console.log("Error leyendo el archivo:", error);
        return;
    }
    const jsonArray = JSON.parse(data);
    doctors = jsonArray;
});

// Crear el método 'get' del directorio '/api/doctors' (recuperar todos los doctores)
router.get('/', (req, resp) => {
    console.log(req.url)
    // Envía el array doctors
    resp.send(doctors)
})

// Crear el método 'get' del directorio '/api/doctors' pero solo un elemento
// Se envían parámetros, para ello se envía el atributo en la url, con : y nombre (:id)
// /api/doctors/:id
router.get('/:id', (req, resp) => {
    console.log(req.url);
    const index = doctors.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
      const doctor = doctors[index];
      console.log(doctor);
      resp.send(doctor);
    } else {
      // el retorno en caso de que no se encuentre el doctor solicitado
      resp.status(404).send(`No se encontró el doctor con el id ${req.params.id}`);
    }
  });
  

// Crear el método 'post' para el directorio '/api/doctor'
// La información se recibe en el body
router.post('/', (req, resp) => {
    // Validar que el nombre esté presente y sea de almenos 3 caracteres
    // if (!req.body.name || req.body.name.length < 3) {
    //     return resp.status(400).send('El nombre del doctor debe ser de al menos 3 caracteres')
    // }

    // Crear un esquema de validación (Joi.object)
    // Definir reglas para cada campo
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        specialty: Joi.string().min(3).required()
    })

    // Llama al método de validar la información (validate)
    const { error } = schema.validate(req.body)

    console.log(error)

    // Si hay un error debe retornar el error 400
    if (error) return resp.status(400).send(error.details[0].message)

    // Se crea el objeto doctor
    const doctor = {
        //id: doctors.length + 1, // autoincremental
        id: utilities.increase(doctors.doctors.length),
        name: req.body.name,
        specialty: req.body.specialty
    }

    // Se agrega el doctor al array
    console.log(doctors)
    doctors.doctors.push(doctor)
    write(doctors.doctors)
    // Se responde el doctor
    resp.send(doctor)
})

// Crear el método 'delete' del directorio '/api/doctors'
// Elimina un elemento recibido por parámetros
router.delete('/:id', (req, resp) => {
    // Buscar el doctor
    const doctor = doctors.find(c => c.id === parseInt(req.params.id))
    if (!doctor) return resp.status(404).send(`No se encontró el doctor con el id ${req.params.id}`)

    // Eliminar el doctor del array
    const index = doctors.indexOf(doctor)
    doctors.splice(index, 1) // Elimina elementos desde el índice señalado
    write(doctors)

    resp.send(doctor)

    //FALTA cancelar las citas (no existe el medoto todavia)
})

function write(list){
    var data = JSON.stringify(list, null, 2)
    
    console.log(list)
    console.log(data)
    
    
    // escribir la info en el archivo JSON
    // recibe
    // path
    // datos
    // callback

    fs.writeFile('./doctors.json', data, (err) => {
        if (err) throw err;
        console.log('Archivo Guardado')
    })

}