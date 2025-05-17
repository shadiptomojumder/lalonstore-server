"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorlogger = exports.logger = void 0;
/* eslint-disable no-undef */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, label, printf } = winston_1.format;
// Define Vercel-safe log directory
const baseLogDir = path_1.default.join('/tmp', 'logs', 'winston');
// Ensure directories exist
const ensureDir = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
ensureDir(path_1.default.join(baseLogDir, 'successes'));
ensureDir(path_1.default.join(baseLogDir, 'errors'));
// Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        console.error("Invalid timestamp received:", timestamp);
        return `${new Date().toDateString()} [${label}] ${level}: ${message}`;
    }
    const hour = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
});
// Main Info Logger
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: 'HADI' }), timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(baseLogDir, 'successes', 'phu-%DATE%-success.log'),
            datePattern: 'YYYY-DD-MM-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});
exports.logger = logger;
// Error Logger
const errorlogger = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(label({ label: 'HADI' }), timestamp(), myFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(baseLogDir, 'errors', 'phu-%DATE%-error.log'),
            datePattern: 'YYYY-DD-MM-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});
exports.errorlogger = errorlogger;
