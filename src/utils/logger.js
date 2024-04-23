import winston from 'winston';
import { configObject } from '../config/config.js';

const {node_env} = configObject;
const levels = {
    level: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}



//Logger para desarrollo: 

const loggerDevelopment = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: levels.colors}), 
                winston.format.simple()
            )
        })
        
    ]
})



//Logger para producción: 

const loggerProduction = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.File({
            filename: "./errors.log",
            level: "error"
        })
    ]
})

const logger = node_env === "produccion" ? loggerProduction : loggerDevelopment;

//Middleware
export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}