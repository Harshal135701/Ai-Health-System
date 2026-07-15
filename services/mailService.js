const nodemailer = require("nodemailer");

// NOTE: Google App Passwords are shown on Google's site with spaces
// (e.g. "abcd efgh ijkl mnop") for readability, but the SMTP auth call
// can silently fail ("Invalid login") if those spaces are copied as-is
// into the .env file. We strip all whitespace defensively here so a
// pasted-with-spaces app password still works.
const emailUser = (process.env.EMAIL_USER || "").trim();
const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

if (!emailUser || !emailPass) {
    console.warn("EMAIL_USER / EMAIL_PASS is missing in .env - outgoing emails will fail.");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

// Fail fast on boot instead of silently swallowing errors on every send.
transporter.verify((err) => {
    if (err) {
        console.error("Mail transporter verification failed. Emails will NOT be sent.");
        console.error("Reason:", err.message);
        console.error("Fix: make sure EMAIL_USER is a full Gmail address and EMAIL_PASS is a");
        console.error("16-character Google App Password (Google Account > Security > App Passwords),");
        console.error("not your normal Gmail login password.");
    } else {
        console.log("Mail transporter is ready to send emails.");
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

async function sendExpiredAppointmentEmail(
    email,
    patientName,
    doctorName,
    appointmentDate
) {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Appointment Expired",
        text: `Hello ${patientName},

Your appointment with Dr. ${doctorName} scheduled on ${appointmentDate} has expired because the appointment time has passed.

If you still need a consultation, please book a new appointment.

Regards,
AI Health Assistant`
    };

    await transporter.sendMail(mailOptions);
}

async function sendBookingConfirmationEmail(
    email,
    patientName,
    doctorName,
    appointmentDate,
    startTime,
    endTime
) {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Appointment Request Received",
        text: `Hello ${patientName},

Your appointment request with Dr. ${doctorName} has been received successfully.

Appointment Date: ${appointmentDate}
Time: ${startTime} - ${endTime}

Your appointment is currently pending confirmation from the doctor. You will receive another email once the doctor confirms or rejects it.

Regards,
AI Health Assistant`
    };

    await transporter.sendMail(mailOptions);
}

async function sendOTPEmail(email, otp) {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is ${otp}.

This OTP is valid for 10 minutes.

If you did not request this, please ignore this email.

Regards,
AI Health Assistant`
    };

    await transporter.sendMail(mailOptions);
}


module.exports = {
    sendStatusEmail,
    sendOTPEmail,
    sendExpiredAppointmentEmail,
    sendBookingConfirmationEmail
};