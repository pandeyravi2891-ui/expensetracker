const ratelimit = require("express-rate-limit");

const loginlimiter = ratelimit({
    windowsMs : 15*60*1000,
    limits : 5,
    message:{
        success : false,
        message:"Too many login attempts . Please try again after 15 minutes."
    },
    standardHeaders:"draft-8",
    legacyHeaders: false
});

const signuplimiter = ratelimit({
    windowsMs : 60*60*1000,
    limits : 5,
    message:{
        success : false,
        message:"Too many signup attempts . Please try again after 15 minutes."
    },
    standardHeaders:"draft-8",
    legacyHeaders: false
});

module.exports = {
    loginlimiter,
    signuplimiter
};