"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const ApiResponse_1 = __importDefault(require("../shared/ApiResponse"));
// Validation middleware
const validateSchema = (schema) => (req, res, next) => {
    // parse request body
    const { success, error } = schema.safeParse(req.body);
    // handle non-compliant request body
    if (!success) {
        (0, ApiResponse_1.default)(res, {
            statusCode: 200,
            success: false,
            message: error.errors
                .map((t) => { var _a; return `${(_a = t.path[0]) !== null && _a !== void 0 ? _a : ""}: ${t.message}`; })
                .join(", "),
        });
        next(error);
    }
    next();
};
exports.validateSchema = validateSchema;
