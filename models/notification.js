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
        
        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
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
                "reminder",
                "payment",
                "system"
            ],
            required: true
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