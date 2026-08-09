const express = require("express")
const router = express.Router();
const { registration, login, logout,forgotPassword,
    verifyOTP,resetPassword,getMe
 } = require("../controllers/authController")
const { authMiddleware } = require("../middlewares/auth")
const { roleMiddleware } = require("../middlewares/roleMiddleware");

router.get("/logout", authMiddleware, logout)
router.get("/me", authMiddleware, getMe)

router.post("/verify-otp", verifyOTP)
router.post('/registration', registration)
router.post("/forgot-password", forgotPassword)
router.post("/login", login)
router.post("/reset-password", resetPassword);



module.exports = router