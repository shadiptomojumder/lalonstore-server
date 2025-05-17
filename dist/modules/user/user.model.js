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
exports.User = void 0;
const normalizePhoneNumber_1 = require("../../shared/normalizePhoneNumber");
const mongoose_1 = __importStar(require("mongoose"));
const userSchemaDefinition = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        trim: true,
    },
    email: { type: String, unique: true, sparse: true }, // Allows multiple null values, but unique non-null values
    phone: { type: String, unique: true, sparse: true },
    address: {
        type: String,
        lowercase: true,
        sparse: true, // Helps avoid creating a blank index
    },
    googleId: {
        type: String,
        unique: true,
        trim: true,
        sparse: true, // Helps avoid creating a blank index
    },
    role: {
        type: String,
        default: "USER",
    },
    avatar: {
        type: String,
        sparse: true, // Helps avoid creating a blank index
    },
    otp: {
        type: Number,
        sparse: true, // Helps avoid creating a blank index
    },
    password: {
        type: String,
        required: true,
        select: false, // Exclude from query results
    },
    refreshToken: {
        type: String,
        select: false, // Exclude from query results
    },
}, {
    timestamps: true,
});
userSchemaDefinition.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v; // Optional: remove __v
    },
});
// Pre-save hook to normalize phone numbers
userSchemaDefinition.pre("save", function (next) {
    if (this.phone) {
        this.phone = (0, normalizePhoneNumber_1.normalizePhoneNumber)(this.phone);
    }
    next();
});
exports.User = mongoose_1.default.model("User", userSchemaDefinition);
