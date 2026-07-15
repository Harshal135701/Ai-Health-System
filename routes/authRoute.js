const express = require("express")
const router = express.Router();
const { registration, login, loginPage, registrationPage, logout,forgotPassword,
    verifyOTP,resetPassword,forgotPass
 } = require("../controllers/authController")
const { authMiddleware } = require("../middlewares/auth")
const { roleMiddleware } = require("../middlewares/roleMiddleware");

router.get("/login", loginPage)
router.get("/registration", registrationPage)
router.get("/logout", authMiddleware, logout)
router.get("/forgot-password", forgotPass)

router.post("/verify-otp", verifyOTP)
router.post('/registration', registration)
router.post("/forgot-password", forgotPassword)
router.post("/login", login)
router.post("/reset-password", resetPassword);



module.exports = router