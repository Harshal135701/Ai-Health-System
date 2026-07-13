const ai = require("../config/gemini");

async function symptomChecker(patientProfile, symptomData) {

  const prompt = `
You are an experienced AI Medical Assistant.

Your task is to analyze the patient's profile and current symptoms.

Patient Profile

Age: ${patientProfile.age}
Gender: ${patientProfile.gender}
Blood Group: ${patientProfile.bloodGroup}
Allergies: ${patientProfile.allergies.join(", ") || "None"}
Medical History: ${patientProfile.medicalHistory.join(", ") || "None"}

Current Symptoms

Symptoms: ${symptomData.symptoms}

Duration: ${symptomData.duration}

Pain Level: ${symptomData.painLevel}/10

-------------------------------------------------

Choose ONLY ONE specialist from this list:

- General Physician
- Cardiologist
- Dermatologist
- Neurologist
- Orthopedic
- Pediatrician
- Gynecologist
- ENT Specialist
- Psychiatrist

-------------------------------------------------

Return ONLY valid JSON.

{
  "possibleConditions":[
    "...",
    "..."
  ],

  "recommendedSpecialist":"",

  "severity":"Low | Moderate | High",

  "precautions":[
    "...",
    "..."
  ],

  "disclaimer":"This is not a medical diagnosis. Please consult a qualified doctor."
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt
  });

  const text = response.text.replace(/```json|```/g, "").trim();

  return JSON.parse(text);

}

module.exports = {
  symptomChecker
};