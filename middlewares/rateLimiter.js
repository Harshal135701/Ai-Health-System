import rateLimit from "express-rate-limit";

export const aiRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 6 minutes
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        status: false,
        message: "Too many AI requests. Please try again after 15 minutes."
    }
});

