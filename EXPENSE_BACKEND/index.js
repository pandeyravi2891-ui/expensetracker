const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

const {connect} = require("./Config/database");
connect();

const fs = require("fs");
const path = require("path");

const user = require("./Routes/route");
app.use("/api/v1" , user);

// Serve frontend build if available, supporting React Router refresh on any route
const frontendDist = path.join(__dirname, "../EXPENSE_FRONTEND/dist");
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api/")) return next();
        res.sendFile(path.join(frontendDist, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("<h1>backend API is running</h1>");
    });
}

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error:", err);
    res.status(500).json({
        success: false,
        message: err.message || "An unexpected error occurred."
    });
});

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
