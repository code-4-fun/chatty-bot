'use strict';

function initLogger () {
    const winston = require('winston');
    const toYAML = require('winston-console-formatter');
    
    const logger = new winston.Logger({ level: "debug" });
    logger.add(winston.transports.Console, toYAML.config());

    logger.info('Logger Initialised...');
    return logger;    
}

module.exports = initLogger();