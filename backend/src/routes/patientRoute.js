const express = require("express")
const router = express.Router();
const { completeProfile, updateProfile } = require("../controllers/patientController")
const { authMiddleware } = require("../middlewares/auth")
const { roleMiddleware } = require("../middlewares/roleMiddleware");

router.post("/profile", authMiddleware, roleMiddleware("patient"), completeProfile);
router.put("/updateProfile", authMiddleware, roleMiddleware("patient"), updateProfile);


module.exports = router;