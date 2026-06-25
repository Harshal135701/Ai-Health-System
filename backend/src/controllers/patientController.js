const userModel = require("../models/user")
const patientProfile = require("../models/patientProfile")
const doctorProfile = require("../models/doctorProfile")

async function completeProfile(req, res) {
    try {
        const { age, gender, bloodGroup, allergies, medicalHistory, address } = req.body;
        if (age === null || age === undefined) {
            return res.status(400).json({
                status: false,
                message: "Fields not exist"
            })
        }

        if (!gender || !bloodGroup || !allergies || !medicalHistory || !address) {
            return res.status(400).json({
                status: false,
                message: "Fields not exist"
            })
        }

        await patientProfile.create({
            userId: req.user._id,
            age,
            gender,
            bloodGroup,
            allergies,
            medicalHistory,
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

        return res.status(200).render("patient/bookAppointment",{
            doctor
        })
    }
    catch (err) {
        return res.redirect("/patient/Alldoctors")
    }
}


module.exports = {
    completeProfile, updateProfile, dashboardPage, Alldoctors, completeDoctorInfo, bookAppointment
}
