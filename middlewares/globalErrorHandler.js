const configure = require('../bootstrap/config.js');
const logger = require("../utils/logger.js");

const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    logger.error(err.stack);

    return res.status(statusCode).json({
        message: err.message,
        errorStack: configure.env === 'development' ? err.stack : 'Internal Server Error'
    });
}

module.exports = globalErrorHandler;