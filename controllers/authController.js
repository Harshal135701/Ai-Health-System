const userModel = require("../models/user")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

async function registration(req, res) {
    try {
        const { name, email, password, phoneNo, role } = req.body;

        if (!name || !email || !password || !phoneNo || !role) {
            return res.status(400).json({
                status: false,
                message: "Fields not exist"
            })
        }

        const emailExist = await userModel.findOne({ email });

        if (emailExist) {
            return res.status(409).json({
                status: false,
                message: "User already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await userModel.create({
            name,
            email,
            password: hashedPassword,
            phoneNo,
            role
        });

        return res.status(201).json({
            status: true,
            message: "User is created"
        })
    }

    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Fields not exist"
            })
        }

        const userExist = await userModel.findOne({ email });

        if (!userExist) {
            return res.status(404).json({
                status: false,
                message: "user not found"
            })
        }

        const comparePass = await bcrypt.compare(password, userExist.password);

        if (!comparePass) {
            return res.status(401).json({
                status: false,
                message: "User is not registed"
            })
        }

        const token = jwt.sign({
            userId: userExist._id,
            role: userExist.role
        },
            process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie('token', token, {
            httpOnly: true,
            // secure: true
        })
        if (userExist.role === 'doctor') {
            return res.redirect('/doctor/dashboard');
        }
        return res.redirect("/patient/dashboard");
        
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

async function loginPage(req, res) {
    try {
        return res.render("auth/login")
    }
    catch (err) {
        return res.status(500).send("Something went wrong")
    }
}

async function registrationPage(req, res) {
    try {
        return res.render("auth/registration")
    }
    catch (err) {
        return res.status(500).send("Something went wrong")
    }
}

module.exports = {
    registration, login, loginPage, registrationPage
}