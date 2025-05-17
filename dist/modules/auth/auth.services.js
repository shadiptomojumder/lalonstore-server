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
exports.AuthServices = void 0;
const auth_schemas_1 = require("./auth.schemas");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const normalizePhoneNumber_1 = require("../../shared/normalizePhoneNumber");
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
// Signup function to register a new user
const signup = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body against the user schema
        const parseBody = auth_schemas_1.signupDataSchema.safeParse(req.body);
        if (!parseBody.success) {
            // If validation fails, collect error messages and throw a BAD_REQUEST error
            const errorMessages = parseBody.error.errors
                .map((error) => error.message)
                .join(",");
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, errorMessages);
        }
        console.log("The parseBody is:", parseBody);
        const { email, phone, password } = parseBody.data;
        // Normalize the phone number
        const normalizedPhone = phone ? (0, normalizePhoneNumber_1.normalizePhoneNumber)(phone) : null;
        // Check if a user with the same email or phone already exists
        let isUserExist;
        if (email) {
            isUserExist = yield user_model_1.User.findOne({ email });
        }
        else if (normalizedPhone) {
            isUserExist = yield user_model_1.User.findOne({ phone: normalizedPhone });
        }
        // If user exists, throw a CONFLICT error
        if (isUserExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "User already exists");
        }
        // Hash the user's password before storing it in the database
        const hashPassword = yield (0, auth_utils_1.hashedPassword)(password);
        // Create a new user in the database with the hashed password
        const result = yield user_model_1.User.create(Object.assign(Object.assign(Object.assign({}, parseBody.data), (normalizedPhone && { phone: normalizedPhone })), { password: hashPassword }));
        // Convert to plain object and remove sensitive fields
        const userObj = result.toObject();
        delete userObj.password;
        return userObj;
    }
    catch (error) {
        console.log("Error creating user", error);
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
// Login function to authenticate a user
const login = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body against the loginData schema
        const parseBody = auth_schemas_1.loginDataSchema.safeParse(req.body);
        console.log("The parseBody is:", parseBody);
        // If validation fails, collect error messages and throw a BAD_REQUEST error
        if (!parseBody.success) {
            const errorMessages = parseBody.error.errors
                .map((error) => error.message)
                .join(",");
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, errorMessages);
        }
        const { email, phone } = parseBody.data;
        // Normalize the phone number
        const normalizedPhone = phone ? (0, normalizePhoneNumber_1.normalizePhoneNumber)(phone) : null;
        // Check if a user with the same email or phone already exists
        // Check if user exists
        let isUserExist = yield user_model_1.User.findOne(email ? { email } : { phone: normalizedPhone })
            .select("_id firstName lastName email phone address googleId role avatar password")
            .lean();
        if (!isUserExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials");
        }
        //console.log("isUserExist is:", isUserExist);
        // Compare the provided password with the hashed password stored in the database
        // Verify password
        const isPasswordValid = yield auth_utils_1.AuthUtils.comparePasswords(parseBody.data.password, isUserExist.password);
        if (!isPasswordValid) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials");
        }
        // Generate JWT tokens for authentication and authorization
        // Generate JWT tokens
        let accessToken, refreshToken;
        try {
            accessToken = auth_utils_1.AuthUtils.generateToken({
                id: isUserExist._id.toString(),
                email: isUserExist.email,
                role: isUserExist.role,
            });
            refreshToken = auth_utils_1.AuthUtils.generateToken({
                id: isUserExist._id.toString(),
                email: isUserExist.email,
                role: isUserExist.role,
            });
        }
        catch (error) {
            //console.log("The token error is:",error);
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to generate authentication tokens");
        }
        // Save the refreshToken in the database
        yield user_model_1.User.findByIdAndUpdate(isUserExist._id, { refreshToken });
        console.log("The Exist User is:", isUserExist);
        // Prepare sanitized user object
        const sanitizedUser = Object.assign(Object.assign({ id: isUserExist._id, firstName: isUserExist.firstName, lastName: isUserExist.lastName, email: isUserExist.email, phone: isUserExist.phone, role: isUserExist.role }, (isUserExist.avatar && { avatar: isUserExist.avatar })), (isUserExist.address && { avatar: isUserExist.address }));
        return {
            data: {
                user: sanitizedUser,
                accessToken,
            },
        };
    }
    catch (error) {
        console.log("The Login service Error:", error);
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
exports.AuthServices = {
    signup,
    login,
};
