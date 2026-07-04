const userModel = require("../models/user")
const patientProfile = require("../models/patientProfile")
const doctorProfile = require("../models/doctorProfile")
const appointmentModel = require("../models/appointment")

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const period = hours >= 12 ? "PM" : "AM";

    const formattedHour = hours % 12 || 12;

    return `${formattedHour}:${mins.toString().padStart(2, "0")} ${period}`;
}
async function completeProfile(req, res) {
    try {

        const {
            age,
            gender,
            bloodGroup,
            allergies,
            medicalHistory,
            address
        } = req.body;

        if (age === null || age === undefined) {
            return res.status(400).json({
                status: false,
                message: "Age is required"
            });
        }

        const user = req.user;

        if (user.isProfileCompleted) {
            return res.status(400).json({
                status: false,
                message: "Profile already completed"
            });
        }

        if (
            !gender ||
            !bloodGroup ||
            !allergies ||
            !medicalHistory ||
            !address
        ) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Profile picture is required"
            });
        }

        const allergiesAre = allergies
            .split(",")
            .map(item => item.trim());

        const medicalHistoryIs = medicalHistory
            .split(",")
            .map(item => item.trim());

        await patientProfile.create({

            userId: user._id,

            age,

            gender,

            bloodGroup,

            allergies: allergiesAre,

            medicalHistory: medicalHistoryIs,

            address,

        });

        await userModel.updateOne(
            { _id: user._id },
            {
                $set: {
                    isProfileCompleted: true,
                    profilePic: "/uploads/profiles/" + req.file.filename
                }
            }
        );

        return res.status(201).json({
            status: true,
            message: "Profile completed successfully"
        });

    } catch (err) {

        return res.status(500).json({
            status: false,
            message: err.message
        });

    }
}
async function updateProfile(req, res) {
    try {

        const {
            age,
            gender,
            bloodGroup,
            allergies,
            medicalHistory,
            address
        } = req.body;

        const updateData = {};

        if (age !== undefined && age !== null) {
            updateData.age = age;
        }

        if (gender) {
            updateData.gender = gender;
        }

        if (bloodGroup) {
            updateData.bloodGroup = bloodGroup;
        }

        if (allergies) {

            updateData.allergies = allergies
                .split(",")
                .map(item => item.trim());

        }

        if (medicalHistory) {

            updateData.medicalHistory = medicalHistory
                .split(",")
                .map(item => item.trim());

        }

        if (address) {
            updateData.address = address;
        }

        if (Object.keys(updateData).length === 0 && !req.file) {
            return res.status(400).json({
                status: false,
                message: "No fields provided to update profile"
            });
        }

        const updatedProfile = await patientProfile.findOneAndUpdate(
            { userId: req.user._id },
            updateData,
            { new: true }
        );

        if (req.file) {

            await userModel.updateOne(
                { _id: req.user._id },
                {
                    $set: {
                        profilePic: "/uploads/profiles/" + req.file.filename
                    }
                }
            );

        }

        return res.status(200).json({
            status: true,
            updatedProfile,
            message: "Profile updated successfully"
        });

    } catch (err) {

        return res.status(500).json({
            status: false,
            message: err.message
        });

    }
}

async function dashboardPage(req, res) {
    try {

        const patient = req.user;

        if (!patient) {
            return res.status(404).json({
                status: false,
                message: "Patient not found"
            });
        }

        // Helper function to convert minutes into HH:MM AM/PM format
        function formatTime(minutes) {

            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;

            const period = hours >= 12 ? "PM" : "AM";
            const formattedHour = hours % 12 || 12;

            return `${formattedHour}:${mins.toString().padStart(2, "0")} ${period}`;
        }

        const appointments = await appointmentModel
            .find({ patientId: patient._id })
            .populate({
                path: "doctorId",
                populate: {
                    path: "userId",
                    select: "name email"
                }
            })
            .sort({ appointmentDate: -1 });

        const totalAppointments = appointments.length;

        const pendingCount = appointments.filter(
            appointment => appointment.appointmentStatus === "pending"
        ).length;

        const confirmedCount = appointments.filter(
            appointment => appointment.appointmentStatus === "confirmed"
        ).length;

        const rejectedCount = appointments.filter(
            appointment => appointment.appointmentStatus === "rejected"
        ).length;

        const today = new Date();

        const upcomingAppointment = appointments.find(appointment => {
            return (
                appointment.appointmentStatus === "confirmed" &&
                new Date(appointment.appointmentDate) >= today
            );
        });

        // Format Upcoming Appointment Time
        const formattedUpcomingAppointment = upcomingAppointment
            ? {
                ...upcomingAppointment.toObject(),
                formattedStartTime: formatTime(upcomingAppointment.startTime),
                formattedEndTime: formatTime(upcomingAppointment.endTime)
            }
            : null;

        // Format Recent Appointments Time
        const recentAppointments = appointments
            .slice(0, 5)
            .map(appointment => ({
                ...appointment.toObject(),
                formattedStartTime: formatTime(appointment.startTime),
                formattedEndTime: formatTime(appointment.endTime)
            }));

        return res.status(200).render("patient/dashboard", {
            patient,

            totalAppointments,

            pendingCount,

            confirmedCount,

            rejectedCount,

            upcomingAppointment: formattedUpcomingAppointment,

            recentAppointments,

            activePage: "dashboard",

            user: req.user,

            status: true,
            message: "Patient Dashboard"
        });

    } catch (err) {

        return res.status(500).json({
            status: false,
            message: err.message
        });

    }
}
async function Alldoctors(req, res) {
    try {

        const {
            doctorName,
            specialization,
            minExperience,
            feeRange,
            page = 1
        } = req.query;

        const limit = 3;
        const currentPage = Number(page);

        const filter = {};

        if (specialization) {
            filter.specialization = specialization;
        }

        if (minExperience) {
            filter.experience = {
                $gte: Number(minExperience)
            };
        }

        if (feeRange) {

            switch (feeRange) {

                case "0-500":
                    filter.consultationFee = {
                        $gte: 0,
                        $lte: 500
                    };
                    break;

                case "500-1000":
                    filter.consultationFee = {
                        $gte: 500,
                        $lte: 1000
                    };
                    break;

                case "1000-2000":
                    filter.consultationFee = {
                        $gte: 1000,
                        $lte: 2000
                    };
                    break;

                case "2000+":
                    filter.consultationFee = {
                        $gte: 2000
                    };
                    break;
            }
        }

        const doctors = await doctorProfile.find(filter)
            .populate({
                path: "userId",
                match: {
                    role: "doctor",
                    isProfileCompleted: true,
                    ...(doctorName && {
                        name: {
                            $regex: doctorName,
                            $options: "i"
                        }
                    })
                },
                select: "name phoneNo email"
            });

        const filteredDoctors = doctors.filter(
            doctor => doctor.userId !== null
        );

        const totalDoctors = filteredDoctors.length;
        const totalPages = Math.ceil(totalDoctors / limit);

        const paginatedDoctors = filteredDoctors.slice(
            (currentPage - 1) * limit,
            currentPage * limit
        );

        return res.status(200).render("patient/Alldoctors", {
            doctors: paginatedDoctors,
            filters: req.query,
            activePage: "Alldoctors",
            user: req.user,
            currentPage,
            totalPages
        });

    } catch (err) {

        return res.status(500).json({
            status: false,
            message: err.message
        });

    }
}

async function completeDoctorInfo(req, res) {
    try {
        const id = req.params.DoctorUserId;
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
        const id = req.params.DoctorUserId;
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

        const doctorId = req.params.DoctorUserId;

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
                doctorId: doctor._id,
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

                doctorId: doctor._id,

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
            activePage: "appointments",
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
            activePage: "profile",
            user: req.user,
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

async function updatePatientProfileGet(req, res) {
    try {
        const userId = req.user;
        const user = await patientProfile.findOne({ userId: userId });
        if (!user) {
            return res.status(200).json({
                status: false,
                message: "user profile is not created yet"
            })
        }
        return res.status(200).render("patient/updateProfile", {
            user,
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
    patientProfileGet, updatePatientProfileGet,
}
