const fs = require('fs');
const winston = require('winston');

const errorLogStream = fs.createWriteStream('logs/error.log', { flags: 'a' });
const combinedLogStream = fs.createWriteStream('logs/combined.log', { flags: 'a' });

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Stream({ stream: errorLogStream }),
        new winston.transports.Stream({ stream: combinedLogStream }),
    ],
});

module.exports = logger;