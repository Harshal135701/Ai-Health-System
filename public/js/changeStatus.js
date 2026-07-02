const forms = document.querySelectorAll(".statusChangeForm");

forms.forEach(form => {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const appointmentId = form.dataset.appointmentId;

        const payload = {
            appointmentStatus: form.appointmentStatus.value
        };

        const isConfirmed = confirm("Are you sure you want to change the appointment status?");
        if (!isConfirmed) return;

        try {

            const response = await fetch(`/doctor/appointments/${appointmentId}/status`, {
                method: "PUT",
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

        } catch (err) {

            console.error(err);
            alert("Something went wrong.");

        }

    });

});