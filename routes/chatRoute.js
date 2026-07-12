const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth");
const { startChat,openChat } = require("../controllers/chatController");

router.get("/:conversationId", authMiddleware, openChat);
router.post("/start", authMiddleware, startChat);

module.exports = router;    