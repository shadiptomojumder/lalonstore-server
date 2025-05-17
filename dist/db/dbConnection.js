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
const config_1 = __importDefault(require("../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../shared/logger");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (mongoose_1.default.connection.readyState >= 1) {
        console.log("Already connected to MongoDB.");
        return;
    }
    try {
        const connectionInstance = yield mongoose_1.default.connect(config_1.default.database_url);
        logger_1.logger.info(`MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`);
        console.log(`MongoDB Connected !! DB-HOST: ${connectionInstance.connection.host} DB-NAME: ${connectionInstance.connection.name}`);
        // Sanitize and log the MongoDB URL
        const sanitizedUrl = ((_a = config_1.default.database_url) !== null && _a !== void 0 ? _a : "").replace(/\/\/.*:.*@/, '//user:***@'); // Mask username and password
        console.log("MongoDB Connection String (Sanitized):", sanitizedUrl); // Safely log the sanitized connection string
        // console.log("MongoDB Connection String:",connectionInstance.connection._connectionString);
    }
    catch (error) {
        console.log("MONGODB CONNECTION FAILD:", error);
        logger_1.errorlogger.error("MongoDB connection failed:", error);
        process.exit(1);
    }
});
exports.default = connectDB;
