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
const auth_utils_1 = require("../modules/auth/auth.utils");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
// Extract token from request
const extractToken = (req) => {
    var _a;
    if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken)
        return req.cookies.accessToken;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }
    return null;
};
const auth = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get authorization token from cookies or headers
        const token = extractToken(req);
        if (!token)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token is missing");
        // Check if the token is blacklisted
        const isBlacklisted = yield auth_utils_1.AuthUtils.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token is blacklisted");
        }
        // Verify token
        const decoded = (0, auth_utils_1.verifyToken)(token);
        if (!decoded) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized.Invalid token");
        }
        console.log("29.decoded dete is:", decoded);
        // Find user in database
        const user = yield user_model_1.User.findById(decoded.id).exec();
        if (!user)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User not found");
        // Check required roles
        if (requiredRoles.length > 0 &&
            (!decoded.role || !requiredRoles.includes(decoded.role))) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized");
        }
        // Attach user to request object
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Error in auth middleware:", error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid token"));
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token expired, please log in again"));
        }
        else {
            next(error);
        }
    }
});
exports.default = auth;
