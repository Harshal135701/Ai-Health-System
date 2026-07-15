const Appointment = require("../models/appointment");
const sendNotification = require("./sendNotification");
const { sendExpiredAppointmentEmail } = require("../services/mailService");

const startAppointmentExpiryScheduler = () => {
    setInterval(async () => {
        try {
            const now = new Date();

            const appointments = await Appointment.find({
                appointmentStatus: {
                    $in: ["pending", "confirmed"]
                }
            })
                .populate({
                    path: "doctorId",
                    select: "userId",
                    populate: {
                        path: "userId",
                        select: "name"
                    }
                })
                .populate("patientId", "name email");

            console.log(`Found ${appointments.length} active appointments`);

            for (const appointment of appointments) {

                const appointmentEnd = new Date(appointment.appointmentDate);

                const hours = Math.floor(appointment.endTime / 60);
                const minutes = appointment.endTime % 60;

                appointmentEnd.setHours(hours, minutes, 0, 0);

                if (appointmentEnd < now) {

                    appointment.appointmentStatus = "expired";
                    await appointment.save();

                    console.log(`Appointment ${appointment._id} expired`);

                    // Notify Doctor
                    await sendNotification({
                        receiverId: appointment.doctorId.userId._id,
                        senderId: appointment.patientId._id,
                        referenceId: appointment._id,
                        referenceModel: "appointment",
                        title: "Appointment Expired",
                        message: `${appointment.patientId.name}'s appointment has expired.`,
                        type: "appointment_expired",
                        redirectUrl: "/doctor/appointments",
                        roomName: `doctor_${appointment.doctorId.userId._id}`
                    });

                    // Notify Patient
                    await sendNotification({
                        receiverId: appointment.patientId._id,
                        senderId: appointment.doctorId.userId,
                        referenceId: appointment._id,
                        referenceModel: "appointment",
                        title: "Appointment Expired",
                        message: "Your appointment has expired.",
                        type: "appointment_expired",
                        redirectUrl: "/patient/appointments",
                        roomName: `patient_${appointment.patientId._id}`
                    });

                    // Send Email to Patient
                    console.log("Patient Email:", appointment.patientId.email);
                    console.log("Doctor Name:", appointment.doctorId.userId.name);

                    try {

                        await sendExpiredAppointmentEmail(
                            appointment.patientId.email,
                            appointment.patientId.name,
                            appointment.doctorId.userId.name,
                            appointment.appointmentDate.toLocaleDateString("en-IN")
                        );

                        console.log("✅ Expiry email sent successfully");

                    } catch (err) {

                        console.error("❌ Expiry email failed");
                        console.error(err);

                    }
                }
            }

        } catch (err) {
            console.log(err);
        }
    }, 60 * 1000);
};

module.exports = startAppointmentExpiryScheduler;