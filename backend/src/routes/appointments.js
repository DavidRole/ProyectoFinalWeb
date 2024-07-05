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
        patient: 1,
        hour: "08:00",
        state: "active",
    },
    {
        employeeId: 1,
        date: "2024-06-18",
        patient: 1,
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

router.get('/patient/:patientId', (req, resp) => {
    const patientId = parseInt(req.params.patientId);
    const patientAppointments = appointments.filter(appointment => appointment.patient === patientId);
    if (patientAppointments.length === 0) {
        resp.status(404).send(`No appointments found for patient ${patientId}`);
    } else {
        resp.send(patientAppointments);
    }
});

router.get('/employee/:employeeId', (req, resp) => {
    const employeeId = parseInt(req.params.employeeId);
    const employeeAppointments = appointments.filter(appointment => appointment.employeeId === employeeId);
    if (employeeAppointments.length === 0) {
        resp.status(404).send(`No appointments found for employee ${employeeId}`);
    } else {
        resp.send(employeeAppointments);
    }
});


router.post('/', (req, resp) => {
    // Crear un esquema de validación para el objeto cita (appointment)
    const schema = Joi.object({
      employeeId: Joi.number().integer().min(1).required(), // ID del empleado (entero)
      date: Joi.string().isoDate().required(), // Fecha de la cita (formato YYYY-MM-DD)
      patient: Joi.number().integer().min(1).required(), // ID del paciente (entero)
      hour: Joi.string().regex(/^\d{2}:\d{2}$/).required(), // Hora de la cita (formato HH:MM)
      state: Joi.string().valid('active', 'inactive').required(), // Estado de la cita (activo o inactivo)
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
      id: utilities.increase(appointments.length), // Suponiendo que utilities.increase genera IDs únicos
      employeeId: parseInt(employeeId), // Convertir a entero
      date,
      patient: parseInt(patient), // Convertir a entero
      hour,
      state,
    };
  
    // Agregar la cita al array appointments
    appointments.push(appointment);
  
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