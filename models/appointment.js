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
    appointmentStatus:{
        type:String,
        required:true,
        enum:["cancelled","pending","confirmed","completed","rejected"],
        default:"pending"
    },
    consultationFee: {
        type: Number,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("appointment", appointmentSchema)