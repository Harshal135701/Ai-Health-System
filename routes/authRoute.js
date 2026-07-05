const express = require("express")
const router = express.Router();
const { registration, login, loginPage, registrationPage, logout } = require("../controllers/authController")
const { authMiddleware } = require("../middlewares/auth")
const { roleMiddleware } = require("../middlewares/roleMiddleware");

router.post('/registration', registration);
router.post("/login", login);
router.get("/login", loginPage);
router.get("/registration", registrationPage);
router.get("/logout", authMiddleware, logout)

module.exports = router