const jwt = require("jsonwebtoken");
const userModel = require("../models/user")

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Not authenticated"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decode.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }
        req.user = user;
        res.locals.user = user;
        next()
    }
    catch (err) {
        return res.status(401).json({
            status: false,
            message: "Not authenticated"
        })
    }
}

module.exports = { authMiddleware };