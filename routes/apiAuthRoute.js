const express = require("express");
const router = express.Router();

const { apiLogin,apiRegister } = require("../controllers/apiAuthController");

router.post("/login", apiLogin);
router.post("/register", apiRegister);

module.exports = router;