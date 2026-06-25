const doctorProfileModel = require("../models/doctorProfile")
const userModel = require("../models/user")

async function completeProfile(req, res) {
    try {
        const { specialization, experience, hospital, education, licenseNumber, consultationFee, availability } = req.body;

        const profileAlreadyExist = await doctorProfileModel.findOne({ userId: req.user._id });
        if (profileAlreadyExist) {
            return res.status(409).json({
                status: false,
                message: "Profile already exist"
            })
        }

        if (!specialization || !hospital || !education || !licenseNumber || !consultationFee || !availability) {
            return res.status(400).json({
                status: false,
                message: "Fields not exist"
            })
        }

        if (experience === undefined || experience === null) {
            return res.status(400).json({
                status: false,
                message: "Fields not exist"
            })
        }

        await doctorProfileModel.create({
            userId: req.user._id,
            specialization,
            experience,
            hospital, education, licenseNumber, consultationFee, availability
        })


        await userModel.updateOne({
            _id: req.user._id
        },
            { $set: { isProfileCompleted: true } }
        );

        return res.status(201).json({
            status: true,
            message: "Profile it completed"
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
        const { specialization, experience, hospital, education, consultationFee, availability } = req.body

        const updateData = {}

        if (specialization) {
            updateData.specialization = specialization
        }
        if (experience !== undefined && experience !== null) {
            updateData.experience = experience
        }
        if (hospital) {
            updateData.hospital = hospital
        }
        if (education) {
            updateData.education = education
        }
        if (consultationFee !== undefined && consultationFee !== null) {
            updateData.consultationFee = consultationFee
        }
        if (availability) {
            updateData.availability = availability
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: false,
                message: "No fields provided to update profile"
            })
        }

        const updatedProfile = await doctorProfileModel.findOneAndUpdate(
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

        const doctor = req.user;
        if (!doctor) {
            return res.status(404).json({
                status: false,
                message: "Doctor not found"
            })
        }
        return res.status(200).render("doctor/dashboard", {
            doctor,
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
    completeProfile, updateProfile, dashboardPage
}
