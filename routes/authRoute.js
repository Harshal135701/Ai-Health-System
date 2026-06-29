const express = require("express")
const router = express.Router();
const { registration ,login,loginPage,registrationPage} = require("../controllers/authController")

router.post('/registration',registration);
router.post("/login",login);
router.get("/login",loginPage);
router.get("/registration",registrationPage);

module.exports=router