const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendStatusEmail(email, patientName, doctorName, appointmentDate, appointmentStatus) {

    let subject = "";
    let text = "";

    if (appointmentStatus === "confirmed") {

        subject = "Appointment Confirmed";

        text = `Hello ${patientName},

Your appointment with Dr. ${doctorName} has been confirmed.

Appointment Date: ${appointmentDate}

We look forward to seeing you.

Regards,
AI Health Assistant`;

    }
    else if (appointmentStatus === "rejected") {

        subject = "Appointment Rejected";

        text = `Hello ${patientName},

We regret to inform you that your appointment with Dr. ${doctorName} has been rejected.

Please book another appointment at your convenience.

Regards,
AI Health Assistant`;

    }
    else {
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendStatusEmail;