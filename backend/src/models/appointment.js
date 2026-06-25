const mongoose = require("mongoose")

const appointmentSchema = mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
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
        enum:["cancelled","pending","confirmed","completed"],
        default:"pending"
    },
    consultationFee: {
        type: Number,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("appointment", appointmentSchema)