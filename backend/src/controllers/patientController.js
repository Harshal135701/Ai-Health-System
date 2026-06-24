const userModel = require("../models/user")
const patientProfile = require("../models/patientProfile")

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


module.exports = {
    completeProfile, updateProfile
}
