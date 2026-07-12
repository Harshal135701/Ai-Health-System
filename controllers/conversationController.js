const Conversation = require("../models/conversation");
const Appointment = require("../models/appointment");
const DoctorProfile = require("../models/doctorProfile");
const Message = require("../models/message");

// Create conversation or return existing one
const createConversation = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }

        // Prevent chatting with yourself
        if (senderId.toString() === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot create a conversation with yourself",
            });
        }

        let doctorUserId;
        let patientUserId;

        // Decide who is doctor and who is patient
        if (req.user.role === "doctor") {
            doctorUserId = senderId;
            patientUserId = receiverId;
        } else if (req.user.role === "patient") {
            doctorUserId = receiverId;
            patientUserId = senderId;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid user role",
            });
        }

        // Find doctor's profile
        const doctorProfile = await DoctorProfile.findOne({
            userId: doctorUserId,
        });

        if (!doctorProfile) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found",
            });
        }

        // Check if appointment exists
        const appointment = await Appointment.findOne({
            doctorId: doctorProfile._id,
            patientId: patientUserId,
            appointmentStatus: {
                $in: ["accepted", "confirmed", "completed"],
            },
        });

        if (!appointment) {
            return res.status(403).json({
                success: false,
                message: "Chat is only available after booking an appointment.",
            });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId],
            },
        });

        if (conversation) {
            return res.status(200).json({
                success: true,
                conversation,
            });
        }

        // Create new conversation
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        });

        return res.status(201).json({
            success: true,
            conversation,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};



const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        // Security check
        if (
            !conversation.participants.some(
                (id) => id.toString() === req.user._id.toString()
            )
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const messages = await Message.find({
            conversationId,
        })
            .populate("sender", "name role profilePic")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};



module.exports = {
    createConversation,getConversationMessages
};