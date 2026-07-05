const express = require("express")
const router = express.Router();
const { completeProfile, updateProfile, dashboardPage, Alldoctors, completeDoctorInfo, bookAppointment, handleBookAppointment, allappointments, cancelAppointment, editAppointment, editAppointmentPost, patientProfileGet, updatePatientProfileGet,
    handleGetPatientNotifications,handleMarkPatientNotificationRead
 } = require("../controllers/patientController")
const { authMiddleware } = require("../middlewares/auth")
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const { profileCompleted } = require("../middlewares/profileCompleted")
const upload = require("../middlewares/multer")

// GET ROUTES
router.get("/dashboard", authMiddleware, dashboardPage);
router.get("/CompleteProfile", authMiddleware, roleMiddleware("patient"), patientProfileGet)
router.get("/updatePatientProfile", authMiddleware, roleMiddleware("patient"), updatePatientProfileGet)
router.get("/Alldoctors", authMiddleware, roleMiddleware("patient"), Alldoctors);
router.get("/doctors/:DoctorUserId", authMiddleware, roleMiddleware("patient"), completeDoctorInfo)
router.get("/:DoctorUserId/appointment/booking", authMiddleware, roleMiddleware("patient"), bookAppointment)
router.get("/appointments/:appointmentId/edit", authMiddleware, roleMiddleware("patient"), editAppointment)
router.get("/appointments", authMiddleware, roleMiddleware("patient"), allappointments)
router.get(
    "/notifications",
    authMiddleware,
    roleMiddleware("patient"),
    handleGetPatientNotifications
);

// POST ROUTES
router.post("/profile", authMiddleware, roleMiddleware("patient"), upload.single("profileImage"), completeProfile);
router.post("/appointment/book/:DoctorUserId", authMiddleware, roleMiddleware("patient"), profileCompleted, handleBookAppointment);


// PUT ROUTES
router.put("/updateProfile", authMiddleware, roleMiddleware("patient"), upload.single("profilePic"), updateProfile);
router.put("/appointments/:appointmentId/edit", authMiddleware, roleMiddleware("patient"), editAppointmentPost)


// DELETE ROUTES
router.delete("/appointments/:appointmentId", authMiddleware, roleMiddleware("patient"), cancelAppointment)

router.patch(
    "/notifications/:notificationId/read",
    authMiddleware,
    roleMiddleware("patient"),
    handleMarkPatientNotificationRead
);


module.exports = router;
