const mongoose = require("mongoose");

let connectionPromise = null;

exports.connect = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL is missing");
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(
            process.env.MONGODB_URL
        ).catch((err) => {
            connectionPromise = null;
            throw err;
        });
    }

    return connectionPromise;
};