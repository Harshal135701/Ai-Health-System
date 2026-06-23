function roleMiddleware(...allowedRoles) {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: false,
                message: "You are not permitted to access this route"
            });
        }

        next();
    }

}

module.exports = roleMiddleware;