const form = document.getElementById("updateProfile");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const isConfirmed = confirm("Update profile?");
    if (!isConfirmed) return;

    const formData = new FormData();

    formData.append("age", form.age.value);
    formData.append("gender", form.gender.value);
    formData.append("bloodGroup", form.bloodGroup.value);
    formData.append("allergies", form.allergies.value);
    formData.append("medicalHistory", form.medicalHistory.value);
    formData.append("address", form.address.value);

    if (form.profilePic.files.length > 0) {

        formData.append(
            "profilePic",
            form.profilePic.files[0]
        );

    }

    const response = await fetch("/patient/updateProfile", {

        method: "PUT",

        body: formData

    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
        window.location.reload();
    }

});