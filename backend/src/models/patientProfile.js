const mongoose = require("mongoose")

const patientProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    bloodGroup: {
        type: String,
        required: true
    },
    allergies: {
        type: [String],
    },
    medicalHistory: {
        type: [String],
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("patientProfile", patientProfileSchema)