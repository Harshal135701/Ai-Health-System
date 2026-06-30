const form = document.getElementById("updateProfile")
form.addEventListener("submit", async function (e) {
    e.preventDefault()

    const isConfirmed = confirm("Update profile ?");
    if (!isConfirmed) return;

    const payload = {
        age: form.age.value,
        gender: form.gender.value,
        bloodGroup: form.bloodGroup.value,
        allergies: form.allergies.value,
        medicalHistory: form.medicalHistory.value,
        address: form.address.value
    }

    const response = await fetch(`/patient/updateProfile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json();

    alert(data.message);


    window.location.reload();

})

