const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database
const { connect } = require("./Config/database");

// Routes
const user = require("./Routes/route");

// Connect database before processing API requests
app.use(async (req, res, next) => {
    try {
        await connect();
        next();
    } catch (err) {
        console.error("Database connection error:", err.message);
        res.status(503).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

app.use("/api/v1", user);

app.get("/", (req, res) => {
    res.status(200).send("Expense Tracker Backend is running");
});

app.use((err, req, res, next) => {
    console.error("Backend error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

module.exports = app;