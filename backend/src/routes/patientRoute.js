const express = require("express")
const router = express.Router();
const { completeProfile, updateProfile,dashboardPage,Alldoctors,completeDoctorInfo,bookAppointment } = require("../controllers/patientController")
const { authMiddleware } = require("../middlewares/auth")
const { roleMiddleware } = require("../middlewares/roleMiddleware");

router.get("/dashboard", authMiddleware, dashboardPage);
router.post("/profile", authMiddleware, roleMiddleware("patient"), completeProfile);
router.put("/updateProfile", authMiddleware, roleMiddleware("patient"), updateProfile);
router.get("/Alldoctors",authMiddleware,roleMiddleware("patient"),Alldoctors);
router.get("/doctors/:DoctorId",authMiddleware,roleMiddleware("patient"),completeDoctorInfo)
router.get("/:DoctorId/appointment/booking",authMiddleware,roleMiddleware("patient"),bookAppointment)

module.exports = router;