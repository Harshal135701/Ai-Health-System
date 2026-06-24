const express = require("express")
const router = express.Router();
const { completeProfile,updateProfile } = require("../controllers/doctorController")
const {authMiddleware}=require("../middlewares/auth")
const {roleMiddleware}=require("../middlewares/roleMiddleware");

router.post("/profile",authMiddleware,roleMiddleware("doctor"),completeProfile);
router.put("/updateProfile",authMiddleware,roleMiddleware("doctor"),updateProfile);

module.exports = router;