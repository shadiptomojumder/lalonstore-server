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
exports.AuthUtils = exports.verifyToken = exports.generateToken = exports.comparePasswords = exports.hashedPassword = void 0;
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = require("./auth.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Function to convert plain text password to hashed password
const hashedPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    try {
        const salt = yield bcryptjs_1.default.genSalt(saltRounds);
        const hashed = yield bcryptjs_1.default.hash(password, salt);
        return hashed;
    }
    catch (error) {
        throw new Error("Error hashing password");
    }
});
exports.hashedPassword = hashedPassword;
// Function to compare plain text password with hashed password
const comparePasswords = (plainTextPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const match = yield bcryptjs_1.default.compare(plainTextPassword, hashedPassword);
        return match;
    }
    catch (error) {
        throw new Error("Error while comparing passwords");
    }
});
exports.comparePasswords = comparePasswords;
// Function to generate a JWT token
const generateToken = (payload) => {
    if (!config_1.default.jwt.secret || !config_1.default.jwt.expires_in) {
        throw new Error("JWT secret or expiration time is not defined in config");
    }
    try {
        const signOptions = {
            algorithm: "HS256",
            expiresIn: config_1.default.jwt.expires_in,
        };
        return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.secret, signOptions);
    }
    catch (error) {
        console.log("Error generating:", error);
        throw new Error("Error generating token");
    }
};
exports.generateToken = generateToken;
// Function to verify a JWT token
const verifyToken = (token) => {
    if (!config_1.default.jwt.secret) {
        throw new Error("JWT secret is not defined in config");
    }
    try {
        return jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
};
exports.verifyToken = verifyToken;
// Function to blacklist a token
const blacklistToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_model_1.BlacklistedToken.create({ token });
});
// Function to check if a token is blacklisted
const isTokenBlacklisted = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const blacklisted = yield auth_model_1.BlacklistedToken.findOne({ token });
    // Return true if the token is found, otherwise false
    return !!blacklisted;
});
exports.AuthUtils = {
    comparePasswords: exports.comparePasswords,
    generateToken: exports.generateToken,
    blacklistToken,
    isTokenBlacklisted,
};
