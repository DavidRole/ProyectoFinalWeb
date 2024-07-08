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
fs.readFile('./routes/appointments.json', "utf-8", (error, data) => {
    if (error) {
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


router.get('/patient/:patientId', (req, resp) => {

    const patientId = parseInt(req.params.patientId);
    const patientAppointments = []

    appointments.appointments.forEach(element => {
        if (element.patient === patientId) {
            patientAppointments.push(element)
        }
    });

    if (patientAppointments.length === 0) {
        console.log(`No appointments found for patient ${patientId}`)
        resp.status(404);
    } else {
        resp.send(patientAppointments);
    }
});

router.get('/doctor/:doctorId', (req, resp) => {

    const doctorId = parseInt(req.params.doctorId);
    const doctorAppointments = []

    appointments.appointments.forEach(element => {
        if (element.employeeId === doctorId) {
            doctorAppointments.push(element)
        }
    });

    if (doctorAppointments.length === 0) {
        console.log(`No appointments found for doctor ${doctorId}`)
        resp.status(404);
    } else {
        console.log(doctorAppointments)
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
    appointments.appointments.push(appointment);
    writeAppointments(appointments);

    resp.send(appointment);
});

router.delete('/:doctorId/:patientId', (req, res) => {

    const docId = parseInt(req.params.doctorId);
    const patientId = parseInt(req.params.patientId);

    const appointmentIndex = appointments.appointments.findIndex(element => {
        return element.employeeId === docId && element.patient === patientId;
    });

    if (appointmentIndex === -1) {
        return res.status(404).send('Cita no encontrada');
    }


    appointments.appointments[appointmentIndex].state = 'canceled';

    writeAppointments(appointments);

    res.status(200).send('Cita cancelada con éxito');
});


router.delete('/:doctorId', (req, res) => {

    const docId = parseInt(req.params.doctorId);

    // Filter appointments to keep only non-canceled ones for other doctors
    let count = 0;
    appointments.appointments.forEach(element => {
        if (element.employeeId === docId) {
            element.state = 'canceled';
            count++;
        }
    });
    if (count === 0) {
        return res.status(404).send('Doctor sin citas asociadas');
    }

    // Update appointments data
    writeAppointments(appointments);

    res.status(200).send('Citas canceladas con éxito'); // Message can be improved
});




function writeAppointments(list) {
    var data = JSON.stringify(list, null, 2)

    console.log(list)
    console.log(data)

    fs.writeFile('./routes/appointments.json', data, (err) => {
        if (err) throw err;
        console.log('Archivo Guardado')
    })

}