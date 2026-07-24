// src/controllers/health.controller.js
const sequelize = require('../config/database');

const getHealth = async (req, res, next) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({
            success: true,
            server: "running",
            database: "connected"
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            server: "running",
            database: "disconnected",
            error: error.message
        });
    }
};

module.exports = {
    getHealth
};