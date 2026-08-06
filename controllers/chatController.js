const Conversation = require("../models/conversation");
const DoctorProfile = require("../models/doctorProfile");
const Appointment = require("../models/appointment");
const Message = require("../models/message");

const startChat = async (req, res) => {
    try {

        const senderId = req.user._id;
        const { receiverId } = req.body;

        let doctorUserId;
        let patientUserId;

        if (req.user.role === "doctor") {
            doctorUserId = senderId;
            patientUserId = receiverId;
        } else {
            doctorUserId = receiverId;
            patientUserId = senderId;
        }

        const doctorProfile = await DoctorProfile.findOne({
            userId: doctorUserId
        });

        if (!doctorProfile) {
            return res.status(404).json({ status: false, message: "Doctor profile not found" });
        }

        const appointment = await Appointment.findOne({
            doctorId: doctorProfile._id,
            patientId: patientUserId,
            appointmentStatus: {
                $in: ["confirmed", "completed"]
            }
        });

        if (!appointment) {
            return res.status(403).json({ status: false, message: "Chat not allowed." });
        }

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        });

        if (!conversation) {

            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });

        }

        return res.status(200).json({ status: true, conversationId: conversation._id });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const openChat = async (req, res) => {
    try {

        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId)
            .populate("participants", "name role profilePic");

        if (!conversation) {
            return res.status(404).json({ status: false, message: "Conversation not found" });
        }

        // Security check
        const isParticipant = conversation.participants.some(
            (p) => p._id.toString() === req.user._id.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({ status: false, message: "Unauthorized" });
        }

        const messages = await Message.find({
            conversationId
        })
            .populate("sender", "name role profilePic")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            status: true,
            user: req.user,
            conversation,
            messages
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

module.exports = {
    startChat, openChat
};
