
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Database
const { connect } = require("./Config/database");

// Routes
const user = require("./Routes/route");
app.use("/api/v1", user);

// Frontend build
const frontendDist = path.join(__dirname, "../EXPENSE_FRONTEND/dist");

if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("<h1>Backend API is running</h1>");
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

// Start server only after database connection
const startServer = async () => {
    try {
        await connect();

        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });

    } catch (err) {
        console.error("Server startup failed:", err);
        process.exit(1);
    }
};

startServer();
