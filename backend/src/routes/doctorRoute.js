const express = require("express")
const router = express.Router();
const { completeProfile, updateProfile,dashboardPage } = require("../controllers/doctorController")
const { authMiddleware } = require("../middlewares/auth")
const { roleMiddleware } = require("../middlewares/roleMiddleware");

router.get("/dashboard", authMiddleware, dashboardPage);
router.post("/profile", authMiddleware, roleMiddleware("doctor"), completeProfile);
router.put("/updateProfile", authMiddleware, roleMiddleware("doctor"), updateProfile);

module.exports = router;