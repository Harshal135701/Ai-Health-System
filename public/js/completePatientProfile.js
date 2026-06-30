const form = document.getElementById("completeProfile")

form.addEventListener("submit", async function (e) {
    e.preventDefault()

    const isConfirmed = confirm("Create profile ?");
    if (!isConfirmed) return;

    const payload = {
        age: form.age.value,
        gender: form.gender.value,
        bloodGroup: form.bloodGroup.value,
        allergies: form.allergies.value,
        medicalHistory: form.medicalHistory.value,
        address: form.address.value
    }

    const response = await fetch(`/patient/profile`, {
        method: "POST",
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

