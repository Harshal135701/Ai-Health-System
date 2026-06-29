document.querySelectorAll(".cancelBtn").forEach(button => {
    button.addEventListener("click", async function () {
        const appointmentId = this.dataset.appointmentId;
        const isConfirmed = confirm("Are you sure you want cancel this appointment?");
        if (!isConfirmed) return;
        const response = await fetch(`/patient/appointments/${appointmentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        alert(data.message);
    });
});