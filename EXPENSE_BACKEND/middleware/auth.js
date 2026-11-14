const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "expense_tracker_jwt_secret_key_2026";

// Helper function to extract and verify user from cookies (via cookie-parser) or headers
exports.getUserFromReq = (req) => {
    try {
        const token = req.cookies?.token ||
                      req.headers?.authorization?.replace("Bearer ", "") ||
                      req.body?.token;

        if (!token) return null;
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
};

// Express authentication middleware using cookie-parser
exports.auth = async (req, res, next) => {
    try {
        // Read token from cookie-parser (req.cookies.token)
        const token = req.cookies?.token ||
                      req.headers?.authorization?.replace("Bearer ", "") ||
                      req.body?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first. Authentication cookie missing."
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};
