const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        // Related document (Appointment, Chat, Prescription, etc.)
        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        // Collection name of the related document
        referenceModel: {
            type: String,
            enum: [
                "appointment",
                "chat",
                "prescription",
                "payment"
            ],
            default: null
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "appointment",
                "appointment_confirmed",
                "appointment_rejected",
                "appointment_cancelled",
                "appointment_completed",
                "appointment_expired",
                "chat",
                "prescription",
                "payment",
                "reminder",
                "system"
            ],
            required: true
        },

        // Frontend will redirect here when notification is clicked
        redirectUrl: {
            type: String,
            default: null
        },

        isRead: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("notification", notificationSchema);