"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const logger_1 = require("../shared/logger");
const handleMongooseError_1 = __importDefault(require("../errors/handleMongooseError"));
// Global error handler middleware
const globalErrorHandler = (error, req, res, next) => {
    var _a;
    // Log the error based on the environment
    if (config_1.default.env === "development") {
        console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, error);
    }
    else {
        logger_1.errorlogger.error(`[ERROR] ${req.method} ${req.originalUrl}:`, error);
    }
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorMessages = [];
    // Handle Mongoose validation errors
    if (error instanceof mongoose_1.Error.ValidationError) {
        const simplifiedError = (0, handleMongooseError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // Handle Zod validation errors
    else if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // Handle custom API errors
    else if (error instanceof ApiError_1.default) {
        statusCode = (_a = error === null || error === void 0 ? void 0 : error.statusCode) !== null && _a !== void 0 ? _a : 500;
        message = error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: req.originalUrl,
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    // Handle general and unexpected errors
    else {
        const unknownError = error;
        statusCode = statusCode !== 500 ? statusCode : 500; // Prevents overriding existing status codes
        message = unknownError.message || "An unexpected error occurred";
        errorMessages = [
            {
                path: req.originalUrl,
                message: message,
            },
        ];
    }
    // Send the error response
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorMessages,
        stack: config_1.default.env === "development" ? error.stack : undefined, // Only show stack trace in development
    });
};
exports.default = globalErrorHandler;
