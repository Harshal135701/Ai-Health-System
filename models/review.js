const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    rating: {
        type: Number,
        required:true,
        min:1,
        max:5
    },
    comment: {
        type: String,
        trim:true
    }
}, { timestamps: true })

module.exports = mongoose.model("review", reviewSchema)