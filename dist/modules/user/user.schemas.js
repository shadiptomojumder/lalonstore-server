"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.userSchema = void 0;
const z = __importStar(require("zod"));
// General user schema for all user operations
exports.userSchema = z.object({
    firstame: z
        .string()
        .min(1, { message: "First name is required" })
        .max(150, { message: "First name cannot exceed 255 characters" }),
    lastame: z
        .string()
        .min(1, { message: "Last name is required" })
        .max(150, { message: "Last name cannot exceed 255 characters" }),
    email: z.string().email().trim().toLowerCase().optional(),
    phone: z
        .string()
        .optional()
        .nullable()
        .refine((value) => !value || /^\d+$/.test(value), {
        message: "Phone number must contain only digits",
    }),
    address: z.string().optional().nullable(),
    googleId: z.string().optional().nullable(),
    role: z.enum(["USER", "ADMIN", "SELLER"]).default("USER"),
    avatar: z.string().optional().nullable(),
    otp: z.number().optional().nullable(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
    refreshToken: z.string().optional().nullable(),
});
// Update user schema by making all fields optional
exports.updateUserSchema = exports.userSchema.partial().extend({});
