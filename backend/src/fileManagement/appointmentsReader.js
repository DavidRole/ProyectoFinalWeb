const fs = require('fs');

function readAppointments() {
  try {
    const data = fs.readFileSync('./appointments.json', 'utf-8');
    const appointments = JSON.parse(data);
    return appointments;
  } catch (error) {
    console.log('Error leyendo el archivo:', error);
    return []; // Return empty array on error
  }
}

module.exports = readAppointments; 