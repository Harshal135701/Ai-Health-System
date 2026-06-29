const form = document.getElementById("AppointmentBooking");
const doctorId = form.dataset.doctorId;
const submitBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const isConfirmed = confirm("Are you sure you want to book this appointment?");
        if (!isConfirmed) return;

        submitBtn.disabled = true;
        submitBtn.innerText = "Booking...";

        const payload = {
            appointmentDate: form.appointmentDate.value,
            startTime: form.startTime.value,
            endTime: form.endTime.value,
            symptoms: form.symptoms.value,
            patientMessage: form.patientMessage.value
        };

        const response = await fetch(`/patient/appointment/book/${doctorId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            window.location.reload();
        }
    }
    catch (err) {
        console.error(err);

        alert("Something went wrong. Please try again.");
    }
    finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Book Appointment";
    }
});