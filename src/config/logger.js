import { createLogger, transports, format} from "winston";
const logFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
);

const logLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
};



// Configuración del logger de desarrollo
const developmentLogger = createLogger({
    levels: logLevels,
    format: logFormat,
    transports: [new transports.Console()],
    level: 'debug',
});

// Configuración del logger de producción
const productionLogger = createLogger({
    levels: logLevels,
    format: logFormat,
    transports: [
        new transports.File({ filename: './logs/errors.log', level: 'error' }),
    ],
    level: 'info',
});


export { developmentLogger, productionLogger };