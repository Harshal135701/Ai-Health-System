const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema({

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

    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment",
        required: true,
        unique: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comment: {
        type: String,
        trim: true
    }

}, { timestamps: true });

module.exports = mongoose.model("review", reviewSchema);