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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("./config"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./shared/logger");
const app = (0, express_1.default)();
// ✅ Add this line before using express-rate-limit
app.set("trust proxy", 1); // Trust first proxy (like Vercel, Heroku, etc.)
// Apply security middlewares
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
}));
// interface CorsOptions {
//   origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
//   credentials: boolean;
// }
// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (config_1.default.allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Register API routes
app.use("/api/v1", routes_1.default);
// Test endpoint to verify server is working
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        message: "Server working....!",
    });
}));
app.get("/", (req, res) => {
    res.send("Lalon Store Server is running..!");
});
// Global error handler middleware
app.use(globalErrorHandler_1.default);
// Handle 404 - Not Found errors
app.use((req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API Not Found",
            },
        ],
    });
});
// Graceful shutdown on SIGTERM signal
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info("SIGTERM signal received: closing HTTP server");
    process.exit(0);
}));
exports.default = app;
