const rateLimit = require("express-rate-limit");

const loginlimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const signuplimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many signup attempts. Please try again after 1 hour."
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    loginlimiter,
    signuplimiter
};