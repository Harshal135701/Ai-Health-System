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

module.exports = {
    completeProfile,
}
