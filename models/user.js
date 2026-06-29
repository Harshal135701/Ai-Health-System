const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: "./utils/profilePic"
    },
    role: {
        type: String,
        enum: ["patient", "doctor"],
        default: "patient"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isProfileCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)