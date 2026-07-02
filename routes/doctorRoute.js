const express = require("express")
const router = express.Router();
const { completeProfile, updateProfile, dashboardPage, completeProfileGet, getProfileForUpdate ,allAppointments,changeStatus} = require("../controllers/doctorController")
const { authMiddleware } = require("../middlewares/auth")
const { roleMiddleware } = require("../middlewares/roleMiddleware");

router.get("/dashboard", authMiddleware, dashboardPage);
router.get("/completeProfile", authMiddleware, roleMiddleware("doctor"), completeProfileGet)
router.get("/updateProfile", authMiddleware, roleMiddleware("doctor"), getProfileForUpdate)
router.get("/appointments",authMiddleware,roleMiddleware("doctor"),allAppointments);
router.post("/profile", authMiddleware, roleMiddleware("doctor"), completeProfile);
router.put("/updateProfile", authMiddleware, roleMiddleware("doctor"), updateProfile);
router.put("/appointments/:appointmentId/status",authMiddleware,roleMiddleware("doctor"),changeStatus)
module.exports = router;