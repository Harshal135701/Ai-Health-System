const form = document.getElementById("completeProfile");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const isConfirmed = confirm("Create profile?");

    if (!isConfirmed) return;

    const formData = new FormData(form);

    const response = await fetch("/patient/profile", {

        method: "POST",

        body: formData

    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {

        window.location.reload();

    }

});