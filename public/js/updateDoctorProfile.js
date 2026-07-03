const form = document.getElementById("updateProfileForm");
const addSlotBtn = document.getElementById("addSlot");
const availabilityContainer = document.getElementById("availabilityContainer");

form.addEventListener("submit", async (e) => {
    console.log("JS Loaded");
    e.preventDefault();

    if (!confirm("Update your profile?")) return;

    const availability = [];
    let hasEmptyTime = false;

    document.querySelectorAll(".availability-slot").forEach(slot => {

        const startTime = slot.querySelector(".startTime").value;
        const endTime = slot.querySelector(".endTime").value;

        if (!startTime || !endTime) {
            hasEmptyTime = true;
        }

        availability.push({
            day: slot.querySelector(".day").value,
            startTime,
            endTime
        });

    });

    if (hasEmptyTime) {
        alert("Please fill start and end time for every availability slot.");
        return;
    }

    const formData = new FormData();

    formData.append("specialization", form.specialization.value);
    formData.append("experience", form.experience.value);
    formData.append("hospital", form.hospital.value);
    formData.append("education", form.education.value);
    formData.append("consultationFee", form.consultationFee.value);

    formData.append(
        "availability",
        JSON.stringify(availability)
    );

    if (form.profilePic.files.length > 0) {

        formData.append(
            "profilePic",
            form.profilePic.files[0]
        );

    }

    const response = await fetch("/doctor/updateProfile", {

        method: "PUT",

        body: formData

    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
        window.location.reload();
    }

});