const fs = require('fs');

function readAppointments() {
  try {
    const data = fs.readFileSync('./appointments.json', 'utf-8');
    const appointments = JSON.parse(data);
    return appointments;
  } catch (error) {
    console.error('Error reading appointments:', error);
    return []; // Return empty array on error
  }
}

// Example usage
const appointments = readAppointments();

console.log('Appointments:', appointments);
// Process the appointments array as needed
