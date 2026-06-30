const userModel = require("../models/user")
const patientProfile = require("../models/patientProfile")
const doctorProfile = require("../models/doctorProfile")
const appointmentModel = require("../models/appointment")

async function completeProfile(req, res) {
    try {
        const { age, gender, bloodGroup, allergies, medicalHistory, address } = req.body;
        if (age === null || age === undefined) {
            return res.status(400).json({
                status: false,
                message: "Fields not exist"
            })
        }
        const user = req.user;

        if (user.isProfileCompleted === true) {
            return res.status(200).json({
                status: true,
                message: "Profile already completed"
            })
        }
        
        if (!gender || !bloodGroup || !allergies || !medicalHistory || !address) {
            return res.status(400).json({
                status: false,
                message: "Fields not exist"
            })
        }

        allergiesAre = req.body.allergies.split(",").map(item => item.trim());
        medicalHistoryIs = req.body.medicalHistory.split(",").map(item => item.trim());

        await patientProfile.create({
            userId: req.user._id,
            age,
            gender,
            bloodGroup,
            allergies: allergiesAre,
            medicalHistory: medicalHistoryIs,
            address
        })


        await userModel.updateOne({
            _id: req.user._id
        },
            { $set: { isProfileCompleted: true } }
        );

        return res.status(201).json({
            status: true,
            message: "The profile is completed"
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}


async function updateProfile(req, res) {
    try {
        const { age, gender, bloodGroup, allergies, medicalHistory, address } = req.body

        const updateData = {}

        if (gender) {
            updateData.gender = gender
        }
        if (age !== undefined && age !== null) {
            updateData.age = age
        }
        if (bloodGroup) {
            updateData.bloodGroup = bloodGroup
        }
        if (allergies) {
            updateData.allergies = allergies
        }
        if (medicalHistory) {
            updateData.medicalHistory = medicalHistory
        }
        if (address) {
            updateData.address = address
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: false,
                message: "No fields provided to update profile"
            })
        }

        const updatedProfile = await patientProfile.findOneAndUpdate(
            { userId: req.user._id },
            updateData,
            { new: true }
        );

        return res.status(200).json({
            updatedProfile,
            status: true,
            message: "Profile is updated"
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}


async function dashboardPage(req, res) {
    try {

        const patient = req.user;
        if (!patient) {
            return res.status(404).json({
                status: false,
                message: "patient not found"
            })
        }
        return res.status(200).render("patient/dashboard", {
            patient,
            status: true,
            message: "user is logged in"
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

async function Alldoctors(req, res) {
    try {

        const doctors = await userModel.find({
            $and: [
                { role: "doctor" },
                { isProfileCompleted: true }
            ]
        })

        if (doctors.length === 0) {
            return res.status(404).json({
                message: "Doctors not found"
            })
        }
        return res.status(200).render("patient/Alldoctors", {
            doctors
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

async function completeDoctorInfo(req, res) {
    try {
        const id = req.params.DoctorId;
        const doctor = await doctorProfile.findOne({
            userId: id
        }).populate("userId")

        if (!doctor) {
            return res.status(404).redirect("/patient/Alldoctors");
        }
        return res.status(200).render("patient/doctorProfile", {
            doctor
        })
    }
    catch (err) {
        return res.status(404).redirect("/patient/Alldoctors");
    }
}

async function bookAppointment(req, res) {
    try {
        const id = req.params.DoctorId;
        const doctor = await doctorProfile.findOne({
            userId: id
        }).populate("userId")

        if (!doctor) {
            return res.status(404).redirect("/patient/Alldoctors");
        }

        return res.status(200).render("patient/bookAppointment", {
            doctor
        })
    }
    catch (err) {
        return res.redirect("/patient/Alldoctors")
    }
}

async function handleBookAppointment(req, res) {
    try {

        const {
            appointmentDate,
            startTime,
            endTime,
            symptoms,
            patientMessage
        } = req.body;

        // Validate Required Fields

        if (
            !appointmentDate ||
            !startTime ||
            !endTime ||
            !symptoms ||
            !patientMessage
        ) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields."
            });
        }

        const patientId = req.user._id;

        // Find Doctor

        const doctorId = req.params.DoctorId;

        const doctor = await doctorProfile.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                status: false,
                message: "Doctor not found."
            });
        }

        // Convert Time into Minutes

        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        const appointmentStartTime =
            startHour * 60 + startMinute;

        const appointmentEndTime =
            endHour * 60 + endMinute;

        // Validate Start < End

        if (appointmentStartTime >= appointmentEndTime) {
            return res.status(400).json({
                status: false,
                message: "End time must be greater than start time."
            });
        }

        // Validate Appointment Date

        const requestedDate = new Date(appointmentDate);
        requestedDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({
                status: false,
                message: "Cannot book appointment in the past."
            });
        }

        // Find Requested Day

        const requestedDay =
            requestedDate.toLocaleDateString("en-US", {
                weekday: "long"
            });

        // Doctor Available?

        const availableSlot =
            doctor.availability.find(
                slot => slot.day === requestedDay
            );

        if (!availableSlot) {
            return res.status(400).json({
                status: false,
                message: `Doctor is not available on ${requestedDay}.`
            });
        }

        // Within Working Hours?

        if (
            appointmentStartTime < availableSlot.startTime ||
            appointmentEndTime > availableSlot.endTime
        ) {
            return res.status(400).json({
                status: false,
                message: "Requested time is outside doctor's working hours."
            });
        }

        // Get Start & End Of Day

        const startOfDay = new Date(requestedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(requestedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Check Doctor Slot Conflict

        const existingAppointments =
            await appointmentModel.find({
                doctorId,
                appointmentDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
                appointmentStatus: {
                    $in: ["pending", "confirmed"]
                }
            });

        for (const appointment of existingAppointments) {

            if (
                appointmentStartTime < appointment.endTime &&
                appointmentEndTime > appointment.startTime
            ) {
                return res.status(409).json({
                    status: false,
                    message: "Requested slot is already booked."
                });
            }
        }

        // Check Patient Slot Conflict

        const patientAppointments =
            await appointmentModel.find({
                patientId,
                appointmentDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
                appointmentStatus: {
                    $in: ["pending", "confirmed"]
                }
            });

        for (const appointment of patientAppointments) {

            if (
                appointmentStartTime < appointment.endTime &&
                appointmentEndTime > appointment.startTime
            ) {
                return res.status(409).json({
                    status: false,
                    message: "You already have another appointment during this time."
                });
            }
        }

        const bookedAppointment =
            await appointmentModel.create({

                doctorId,

                patientId,

                appointmentDate: requestedDate,

                startTime: appointmentStartTime,

                endTime: appointmentEndTime,

                symptoms,

                patientMessage,

                consultationFee: doctor.consultationFee
            });

        return res.status(201).json({

            status: true,

            message: "Appointment booked successfully.",

            appointment: bookedAppointment
        });

    }
    catch (err) {

        return res.status(500).json({

            status: false,

            message: err.message
        });
    }
}

async function allappointments(req, res) {
    try {

        const user = req.user;

        const allappointments = await appointmentModel
            .find({
                patientId: user._id
            })
            .populate({
                // We are using nested populate 
                // because in doctorId only access doctor profile 
                // but to access user model we need this
                path: "doctorId",
                populate: {
                    path: "userId"
                }
            })
            .sort({ appointmentDate: -1 });

        return res.status(200).render("patient/appointments", {
            status: true,
            appointments: allappointments,
            user
        });

    }
    catch (err) {

        return res.status(500).json({
            status: false,
            message: err.message
        });

    }
}

async function cancelAppointment(req, res) {
    try {
        const appointmentId = req.params.appointmentId;
        if (!appointmentId) {
            return res.status(404).json({
                status: false,
                message: "The appointment not found"
            })
        }
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                status: false,
                message: "The appointment not found"
            })
        }

        if (!appointment.patientId.equals(req.user._id)) {
            return res.status(403).json({
                status: false,
                message: "Not permitted to cancel appointment"
            });
        }

        if (appointment.appointmentStatus !== 'pending') {
            return res.status(400).json({
                status: false,
                message: "Not able to cancel the appointment"
            })
        }
        appointment.appointmentStatus = "cancelled";
        await appointment.save();

        return res.status(200).json({
            status: true,
            message: "The appointment is cancelled"
        })

    }
    catch (err) {
        return res.status(500).json({
            status: true,
            message: err.message
        })
    }
}

async function editAppointment(req, res) {
    try {
        const appointmentId = req.params.appointmentId;
        return res.status(200).render("patient/editAppointment", { appointmentId })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

async function editAppointmentPost(req, res) {
    try {

        const appointmentId = req.params.appointmentId;

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                status: false,
                message: "Appointment not found."
            });
        }

        if (!appointment.patientId.equals(req.user._id)) {
            return res.status(403).json({
                status: false,
                message: "Not permitted to update this appointment."
            });
        }

        if (appointment.appointmentStatus !== "pending") {
            return res.status(400).json({
                status: false,
                message: "Only pending appointments can be updated."
            });
        }

        const {
            appointmentDate,
            startTime,
            endTime,
            symptoms,
            patientMessage
        } = req.body;

        if (
            !appointmentDate ||
            !startTime ||
            !endTime ||
            !symptoms ||
            !patientMessage
        ) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields."
            });
        }

        const doctorId = appointment.doctorId;
        const patientId = appointment.patientId;

        const doctor = await doctorProfile.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                status: false,
                message: "Doctor not found."
            });
        }

        // Convert Time into Minutes

        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        const appointmentStartTime =
            startHour * 60 + startMinute;

        const appointmentEndTime =
            endHour * 60 + endMinute;

        // Validate Start < End

        if (appointmentStartTime >= appointmentEndTime) {
            return res.status(400).json({
                status: false,
                message: "End time must be greater than start time."
            });
        }

        // Validate Appointment Date

        const requestedDate = new Date(appointmentDate);
        requestedDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (requestedDate < today) {
            return res.status(400).json({
                status: false,
                message: "Cannot book appointment in the past."
            });
        }

        // Find Requested Day

        const requestedDay =
            requestedDate.toLocaleDateString("en-US", {
                weekday: "long"
            });

        // Doctor Available?

        const availableSlot =
            doctor.availability.find(
                slot => slot.day === requestedDay
            );

        if (!availableSlot) {
            return res.status(400).json({
                status: false,
                message: `Doctor is not available on ${requestedDay}.`
            });
        }

        // Within Working Hours?

        if (
            appointmentStartTime < availableSlot.startTime ||
            appointmentEndTime > availableSlot.endTime
        ) {
            return res.status(400).json({
                status: false,
                message: "Requested time is outside doctor's working hours."
            });
        }

        // Get Start & End Of Day

        const startOfDay = new Date(requestedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(requestedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Check Doctor Slot Conflict

        const existingAppointments =
            await appointmentModel.find({
                doctorId,
                _id: { $ne: appointmentId },
                appointmentDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
                appointmentStatus: {
                    $in: ["pending", "confirmed"]
                }
            });

        for (const existingAppointment of existingAppointments) {

            if (
                appointmentStartTime < existingAppointment.endTime &&
                appointmentEndTime > existingAppointment.startTime
            ) {
                return res.status(409).json({
                    status: false,
                    message: "Requested slot is already booked."
                });
            }
        }

        // Check Patient Slot Conflict

        const patientAppointments =
            await appointmentModel.find({
                patientId,
                // we are not checking the self exist appointment
                _id: { $ne: appointmentId },
                appointmentDate: {
                    $gte: startOfDay,
                    $lte: endOfDay
                },
                appointmentStatus: {
                    $in: ["pending", "confirmed"]
                }
            });

        for (const patientAppointment of patientAppointments) {

            if (
                appointmentStartTime < patientAppointment.endTime &&
                appointmentEndTime > patientAppointment.startTime
            ) {
                return res.status(409).json({
                    status: false,
                    message: "You already have another appointment during this time."
                });
            }
        }

        appointment.appointmentDate = requestedDate;
        appointment.startTime = appointmentStartTime;
        appointment.endTime = appointmentEndTime;
        appointment.symptoms = symptoms;
        appointment.patientMessage = patientMessage;

        await appointment.save();

        return res.status(200).json({
            status: true,
            message: "Appointment updated successfully.",
            appointment
        });

    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}

async function patientProfileGet(req, res) {
    try {
        return res.status(200).render("patient/profile", {
            status: true,
            message: "user is logged in"
        })
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

module.exports = {
    completeProfile, updateProfile, dashboardPage, Alldoctors, completeDoctorInfo, bookAppointment
    , handleBookAppointment, allappointments, cancelAppointment, editAppointment, editAppointmentPost,
    patientProfileGet,
}
