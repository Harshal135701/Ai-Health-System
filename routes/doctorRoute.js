const express = require("express")
const router = express.Router();
const { completeProfile, updateProfile, dashboardPage, completeProfileGet, getProfileForUpdate, allAppointments, changeStatus,handleGetNotifications } = require("../controllers/doctorController")
const { authMiddleware } = require("../middlewares/auth")
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/multer")


router.get("/dashboard", authMiddleware, dashboardPage);
router.get("/completeProfile", authMiddleware, roleMiddleware("doctor"), completeProfileGet)
router.get("/updateProfile", authMiddleware, roleMiddleware("doctor"), getProfileForUpdate)
router.get("/appointments", authMiddleware, roleMiddleware("doctor"), allAppointments);
router.get("/notifications", authMiddleware, roleMiddleware("doctor"), handleGetNotifications);


router.post("/profile", authMiddleware, roleMiddleware("doctor"), upload.single("profilePic"), completeProfile);

router.put("/updateProfile", authMiddleware, roleMiddleware("doctor"), upload.single("profilePic"), updateProfile);
router.put("/appointments/:appointmentId/status", authMiddleware, roleMiddleware("doctor"), changeStatus)
module.exports = router;