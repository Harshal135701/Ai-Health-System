const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const apiLogin = async (req, res) => {
    try {
        console.log("API LOGIN HIT");
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
        });

        return res.status(200).json({
            status: true,
            message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
            },
        });

    } catch (err) {

        return res.status(500).json({
            status: false,
            message: err.message,
        });

    }
};

async function apiRegister(req, res) {
    try {
        const { name, email, password, phoneNo, role } = req.body;

        if (!name || !email || !password || !phoneNo || !role) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNo,
            role,
        });

        return res.status(201).json({
            status: true,
            message: "Registration Successful",
        });

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

module.exports = {
    apiLogin, apiRegister
};