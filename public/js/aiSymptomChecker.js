const form = document.getElementById("aiSymptomCheckerForm");
const submitBtn = form.querySelector("button");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        submitBtn.disabled = true;
        submitBtn.innerText = "Analyzing...";

        const payload = {
            symptoms: form.symptoms.value,
            duration: form.duration.value,
            painLevel: form.painLevel.value
        };

        const response = await fetch("/patient/ai-symptom-checker", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        displayResult(data.data);

    }
    catch (err) {

        alert(err.message);

    }
    finally {

        submitBtn.disabled = false;
        submitBtn.innerText = "Analyze Symptoms";

    }

});

function displayResult(result) {

    let resultDiv = document.getElementById("aiResult");

    if (!resultDiv) {

        resultDiv = document.createElement("div");
        resultDiv.id = "aiResult";

        document.body.appendChild(resultDiv);

    }

    resultDiv.innerHTML = `
    
        <hr>

        <h2>AI Analysis</h2>

        <h3>Possible Conditions</h3>

        <ul>
            ${result.possibleConditions.map(condition => `<li>${condition}</li>`).join("")}
        </ul>

        <h3>Recommended Specialist</h3>

        <p>${result.recommendedSpecialist}</p>

        <h3>Severity</h3>

        <p>${result.severity}</p>

        <h3>Precautions</h3>

        <ul>
            ${result.precautions.map(item => `<li>${item}</li>`).join("")}
        </ul>

        <h3>Disclaimer</h3>

        <p>${result.disclaimer}</p>

    `;
}