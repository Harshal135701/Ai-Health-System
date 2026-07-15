const userModel = require("../models/user")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const OTP = require("../models/otp");
const { sendOTPEmail } = require("../services/mailService");

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

async function logout(req, res) {
    try {
        // 1. Clear the cookie
        res.clearCookie("token");

        // 2. Send a response to the client to confirm success
        return res.redirect("/login")
    }
    catch (err) {
        // 3. Handle errors
        console.error("Logout error:", err); // Always good to log the error for debugging
        return res.status(500).send("Something went wrong");
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Check user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).render("auth/forgotPassword", {
                success: false,
                message: "User not found"
            });
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Delete old OTP if exists
        await OTP.deleteOne({ email });

        // 4. Set expiry time (5 minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // 5. Save new OTP
        await OTP.create({
            email,
            otp,
            expiresAt,
            isVerified: false
        });

        // 6. Send OTP email
        await sendOTPEmail(email, otp);

        res.render("auth/verifyOTP", {
            email
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifyOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;


        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }


        // Find OTP record
        const otpRecord = await OTP.findOne({ email });


        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired"
            });
        }


        // Check expiry
        if (otpRecord.expiresAt < new Date()) {

            await OTP.deleteOne({ email });

            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }


        // Check OTP
        if (otpRecord.otp !== otp) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }


        // Mark OTP verified
        otpRecord.isVerified = true;

        await otpRecord.save();


        return res.render("auth/resetPassword", {
            email
        });


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const resetPassword = async (req, res) => {

    try {

        const { email, newPassword } = req.body;


        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and new password are required"
            });
        }


        // Password validation
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


        // if (!passwordRegex.test(newPassword)) {

        //     return res.status(400).json({
        //         success: false,
        //         message: "Password must contain minimum 8 characters, one uppercase, one lowercase and one number"
        //     });

        // }


        // Check OTP verification
        const otpRecord = await OTP.findOne({ email });


        if (!otpRecord || !otpRecord.isVerified) {

            return res.status(400).json({
                success: false,
                message: "OTP verification required"
            });

        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;

        await user.save();

        // Delete OTP after successful reset
        await OTP.deleteOne({ email });

        res.redirect("/login");

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

async function forgotPass(req, res) {
    res.render("auth/forgotPassword");
}

module.exports = {
    registration, login, loginPage, registrationPage, logout, forgotPassword, verifyOTP,
    resetPassword, forgotPass
}