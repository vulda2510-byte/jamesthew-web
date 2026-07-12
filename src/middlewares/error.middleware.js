// src/middlewares/error.middleware.js
const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        message: message
    });
};

module.exports = errorMiddleware;