const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate conversations between the same two users
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);