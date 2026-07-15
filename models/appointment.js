const mongoose = require("mongoose")

const appointmentSchema = mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctorProfile",
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    symptoms: {
        type: String,
    },
    patientMessage: {
        type: String,
    },
    appointmentStatus: {
        type: String,
        required: true,
        enum: [
            "cancelled",
            "pending",
            "confirmed",
            "completed",
            "rejected",
            "expired"
        ],
        default: "pending"
    },
    consultationFee: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["online", "hospital"],
        default: "hospital"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    paymentId: {
        type: String,
        default: ""
    },
    orderId: {
        type: String,
        default: ""
    }
}, { timestamps: true })

module.exports = mongoose.model("appointment", appointmentSchema)