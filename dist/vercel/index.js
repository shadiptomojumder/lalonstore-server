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
exports.default = handler;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const dbConnection_1 = __importDefault(require("../db/dbConnection"));
// Vercel serverless function handler
// This function will be called by Vercel when a request is made to the serverless function
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check the MongoDB connection status by inspecting mongoose.connection.readyState
        if (mongoose_1.default.connection.readyState === 0) { // 0 means disconnected
            try {
                yield (0, dbConnection_1.default)(); // This will attempt to connect MongoDB
                console.log("MongoDB Connected inside Vercel function!");
            }
            catch (error) {
                console.error("MongoDB connection failed:", error);
                return res.status(500).json({ message: "Database connection failed" });
            }
        }
        // Now pass the request to the Express app
        (0, app_1.default)(req, res); // Vercel-specific, but make sure app is set up correctly
    });
}
