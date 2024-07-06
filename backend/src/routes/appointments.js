// Importar el módulo expres mediante un enrutador Router
const { throws, ifError } = require('assert')
const fs = require('fs')
const path = require('path')
const { domainToASCII } = require('url')
const { Router } = require('express')
const router = Router()

// Importar el módulo joi
const Joi = require('joi')
const { json } = require('body-parser')

// Exportar los métodos del servidor express (GET, GET/:i, POST, PUT, DELETE)
module.exports = router

// Estructura de almacenamiento
// appointment (employeeId (int), date (String), patient (int), hour (String), state (String))
let appointments = [];
fs.readFile('./routes/appointments.json', "utf-8", (error, data) =>{
    if(error){
        console.log("Error leyendo el archivo:", error);
        return;
    }
    const jsonArray = JSON.parse(data);
    appointments = jsonArray;
});

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

router.get('/patient/:patientId', (req, resp) => {
    const patientId = parseInt(req.params.patientId);
    const patientAppointments = appointments.filter(appointment => appointment.patient === patientId);
    if (patientAppointments.length === 0) {
        resp.status(404).send(`No appointments found for patient ${patientId}`);
    } else {
        resp.send(patientAppointments);
    }
});

router.get('/doctor/:doctorId', (req, resp) => {
    const doctorId = parseInt(req.params.doctorId);
    const doctorAppointments = appointments.filter(appointment => appointment.doctorId === doctorId);
    if (doctorAppointments.length === 0) {
        resp.status(404).send(`No appointments found for doctor ${doctorId}`);
    } else {
        resp.send(doctorAppointments);
    }
});


router.post('/', (req, resp) => {
    // Crear un esquema de validación para el objeto cita (appointment)

    const schema = Joi.object({
        employeeId: Joi.number().integer().min(1).required(), // ID del empleado (entero)
        date: Joi.string().isoDate().required(), // Fecha de la cita (formato YYYY-MM-DD)
        patient: Joi.number().integer().min(1).required(), // ID del paciente (entero)
        hour: Joi.string().regex(/^\d{2}:\d{2}$/).required(), // Hora de la cita (formato HH:MM)
        state: Joi.string().valid('active', 'canceled').required(), // Estado de la cita (activa o cancelada)
    });

    // Validar el cuerpo de la solicitud contra el esquema
    const { error } = schema.validate(req.body);

    if (error) {
        // Devolver un error 400 Solicitud incorrecta con detalles
        return resp.status(400).send(error.details[0].message);
    }

    // Extraer los datos validados de la cita
    const { employeeId, date, patient, hour, state } = req.body;

    // Crear el objeto cita (appointment)
    const appointment = {
        employeeId: parseInt(employeeId), // Convertir a entero
        date,
        patient: parseInt(patient), // Convertir a entero
        hour,
        state,
    };

    // Agregar la cita al array appointments
    appointments.push(appointment);
    writeAppointments(appointments);
    // Enviar una respuesta exitosa con la cita creada
    resp.send(appointment);
});



// Crear el método 'delete' del directorio '/api/appointments'
// Elimina un elemento recibido por parámetros
router.delete('/:id', (req, resp) => {
    // Buscar la cita
    const appointment = appointments.find(c => c.id === parseInt(req.params.id))
    if (!appointment) return resp.status(404).send(`No se encontró la cita con el id ${req.params.id}`)

    // Eliminar la cita del array
    const index = appointments.indexOf(appointment)
    appointments.splice(index, 1) // Elimina elementos desde el índice señalado

    writeAppointments(appointments);

    resp.send(appointment)
})
   

function writeAppointments(list) {
    var data = JSON.stringify(list, null, 2)

    console.log(list)
    console.log(data)

    fs.writeFile('./routes/appointments.json', data, (err) => {
        if (err) throw err;
        console.log('Archivo Guardado')
    })

}