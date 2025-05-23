"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const dbConnection_1 = __importDefault(require("./db/dbConnection"));
const logger_1 = require("./shared/logger");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield (0, dbConnection_1.default)();
            // Start the server
            const server = app_1.default.listen(config_1.default.port, () => {
                logger_1.logger.info(`Server running on port ${config_1.default.port}`);
            });
            // Function to handle server shutdown
            const exitHandler = () => {
                if (server) {
                    server.close(() => {
                        logger_1.logger.info("Server closed");
                    });
                }
                process.exit(1);
            };
            // Function to handle unexpected errors
            const unexpectedErrorHandler = (error) => {
                logger_1.errorlogger.error(error);
                exitHandler();
            };
            // Listen for uncaught exceptions and handle them
            process.on("uncaughtException", unexpectedErrorHandler);
            // Listen for unhandled promise rejections and handle them
            process.on("unhandledRejection", unexpectedErrorHandler);
            // Listen for SIGTERM signal and handle graceful shutdown
            process.on("SIGTERM", () => {
                logger_1.logger.info("SIGTERM received");
                if (server) {
                    server.close(() => {
                        logger_1.logger.info("Server closed due to SIGTERM");
                    });
                }
            });
        }
        catch (error) {
            // Log error and exit process if server fails to start
            logger_1.errorlogger.error("Failed to start the server:", error);
            process.exit(1);
        }
    });
}
startServer();
