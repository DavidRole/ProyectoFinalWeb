const doctorSelect = document.getElementById('list');
const detailButton = document.getElementById('detail');


function fetchDoctors() {
    console.log('Fetching doctors...');
    const xhr = new XMLHttpRequest();
    xhr.open('get', 'http://127.0.0.1:3000/api/doctors/');

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const doctors = JSON.parse(xhr.responseText);
                console.log('Doctors:', doctors);
                populateDoctorSelect(doctors);
            } catch (error) {
                console.error('Error parsing JSON response:', error);
            }
        } else {
            console.error('Error fetching doctors:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error fetching doctors');
    };

    xhr.send();
}

function populateDoctorSelect(doctors) {
    console.log('Populating doctor select...');
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.text = `Dr. ${doctor.name}`;
        doctorSelect.appendChild(option);
    });

    doctorSelect.disabled = false;
    detailButton.disabled = false;
}


doctorSelect.addEventListener('change', function () {
    const selectedDoctorId = this.value;
    if (selectedDoctorId !== 'default') {
        detailButton.disabled = false;
    } else {
        detailButton.disabled = true;
    }
});


detailButton.addEventListener('click', function () {
    const selectedDoctorId = doctorSelect.value;
    if (selectedDoctorId !== 'default') {
      console.log(`Selected doctor ID: ${selectedDoctorId}`);
      window.location.href = `DoctorDetails.html?doctorId=${selectedDoctorId}`;
    } else {
      console.error('No doctor selected');
    }
  });

fetchDoctors(); 
