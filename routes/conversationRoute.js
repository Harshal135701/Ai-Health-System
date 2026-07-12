const express = require("express");
const router = express.Router();

const { createConversation,getConversationMessages } = require("../controllers/conversationController");
const {authMiddleware} = require("../middlewares/auth");


router.get("/:conversationId/messages", authMiddleware, getConversationMessages);
router.post("/", authMiddleware, createConversation);

module.exports = router;