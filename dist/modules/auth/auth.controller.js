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
exports.AuthController = void 0;
const auth_services_1 = require("./auth.services");
const config_1 = __importDefault(require("../../config"));
const ApiResponse_1 = __importDefault(require("../../shared/ApiResponse"));
const asyncErrorHandler_1 = __importDefault(require("../../shared/asyncErrorHandler"));
const http_status_codes_1 = require("http-status-codes");
const auth_utils_1 = require("./auth.utils");
const parseExpiry_1 = require("../../shared/parseExpiry");
// Controller function to handle user signup
const signup = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Call the signup service to create a new user
    const result = yield auth_services_1.AuthServices.signup(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "User created successfully!",
        data: result,
    });
}));
// Controller function to handle user login
const login = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Call the login service to authenticate the user
    const result = yield auth_services_1.AuthServices.login(req);
    const { accessToken, user } = result.data;
    //console.log("result user is:", result.data.user);
    // Set the refresh token into a cookie with secure and httpOnly options
    const cookieOptions = {
        httpOnly: true,
        secure: config_1.default.env === "production",
        maxAge: (0, parseExpiry_1.parseExpiry)(config_1.default.jwt.expires_in || "10m"),
        sameSite: "none",
    };
    res.cookie("accessToken", accessToken, cookieOptions);
    // Send a response with the user data and tokens
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User logged in successfully !",
        data: {
            user: Object.assign({}, user),
            accessToken,
        },
    });
}));
// Controller function to handle user logout
const logout = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]); // Bearer <token>
    // console.log("15.The accessToken is:", req.cookies?.accessToken);
    // Define secure cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: config_1.default.env === "production",
        path: "/", // Ensure cookies are cleared for the entire site
    };
    // Clear the access token from cookies
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    // Invalidate token (if it exists)
    if (token) {
        try {
            yield auth_utils_1.AuthUtils.blacklistToken(token);
        }
        catch (error) {
            console.error("Error blacklisting token:", error);
            return (0, ApiResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Error logging out. Please try again.",
            });
        }
    }
    // Send a proper logout success response
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User logged out successfully!",
    });
}));
exports.AuthController = {
    signup,
    login,
    logout,
};
