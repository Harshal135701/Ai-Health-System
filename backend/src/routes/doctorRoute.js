const express = require("express")
const router = express.Router();
const { completeProfile } = require("../controllers/doctorController")
const {authMiddleware}=require("../middlewares/auth")
const {roleMiddleware}=require("../middlewares/roleMiddleware");

router.post("/profile",authMiddleware,roleMiddleware("doctor"),completeProfile);

module.exports = router;