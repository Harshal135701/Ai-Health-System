const form = document.getElementById("editAppointment")
const appointmentId = form.dataset.appointmentId

form.addEventListener("submit", async function (e) {
    e.preventDefault()

    const isConfirmed = confirm("Are you sure you want to edit this appointment?");
    if (!isConfirmed) return;

    const payload = {
        appointmentDate: form.appointmentDate.value,
        startTime: form.startTime.value,
        endTime: form.endTime.value,
        symptoms: form.symptoms.value,
        patientMessage: form.patientMessage.value
    }

    const response = await fetch(`/patient/appointments/${appointmentId}/edit`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    
    const data = await response.json();

    alert(data.message);

    if (response.ok) {
        window.location.reload();
    }
})

