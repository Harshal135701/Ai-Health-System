const mongoose = require("mongoose")

const doctorProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    specialization: {
        type: String
    },
    experience: {
        type: Number,
        default: 0
    },
    hospital: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    consultationFee: {
        type: Number,
        required: true,
    },
    availability: [
        {
            day: {
                type: String,
                required: true
            },

            startTime: {
                type: Number,
                required: true
            },

            endTime: {
                type: Number,
                required: true
            }
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

module.exports = mongoose.model("doctorProfile", doctorProfileSchema)