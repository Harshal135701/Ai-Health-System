const form = document.getElementById("updateProfileForm");
const addSlotBtn = document.getElementById("addSlot");
const availabilityContainer = document.getElementById("availabilityContainer");

addSlotBtn.addEventListener("click", () => {

    const div = document.createElement("div");

    div.classList.add("availability-slot");

    div.innerHTML = `
        <br>

        <select class="day">
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
        </select>

        <input type="time" class="startTime" placeholder="Start Time">

        <input type="time" class="endTime" placeholder="End Time">

        <button type="button" class="removeSlot">
            Remove
        </button>
    `;

    availabilityContainer.appendChild(div);

});

availabilityContainer.addEventListener("click", (e) => {

    if (e.target.classList.contains("removeSlot")) {

        if (availabilityContainer.children.length > 1) {
            e.target.parentElement.remove();
        } else {
            alert("At least one availability slot is required.");
        }

    }

});

form.addEventListener("submit", async (e) => {

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

    const payload = {
        specialization: form.specialization.value,
        experience: Number(form.experience.value),
        hospital: form.hospital.value,
        education: form.education.value,
        consultationFee: Number(form.consultationFee.value),
        availability
    };

    const response = await fetch("/doctor/updateProfile", {
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

});