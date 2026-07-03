form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!confirm("Complete your profile?")) return;

    const availability = [];

    document.querySelectorAll(".availability-slot").forEach(slot => {

        availability.push({
            day: slot.querySelector(".day").value,
            startTime: slot.querySelector(".startTime").value,
            endTime: slot.querySelector(".endTime").value
        });

    });

    const formData = new FormData();

    formData.append("specialization", form.specialization.value);
    formData.append("experience", form.experience.value);
    formData.append("hospital", form.hospital.value);
    formData.append("education", form.education.value);
    formData.append("licenseNumber", form.licenseNumber.value);
    formData.append("consultationFee", form.consultationFee.value);

    formData.append(
        "availability",
        JSON.stringify(availability)
    );

    formData.append(
        "profilePic",
        form.profilePic.files[0]
    );

    const response = await fetch("/doctor/profile", {

        method: "POST",

        body: formData

    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
        window.location.reload();
    }

});