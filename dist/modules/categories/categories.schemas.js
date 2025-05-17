"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryUpdateSchema = exports.categorySchema = void 0;
const zod_1 = require("zod");
// Category validation schema
exports.categorySchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, "Category title must be at least 3 characters")
        .max(50, "Category title not more than 50 characters")
        .trim(),
    value: zod_1.z
        .string()
        .min(3)
        .max(50)
        .regex(/^[a-z0-9_]+$/, "Value must be lowercase with underscores only") // Enforces proper format
        .trim()
        .optional(),
    logo: zod_1.z.any().optional(),
    thumbnail: zod_1.z.any().optional()
});
// Category Update Schema (to handle updates)
exports.categoryUpdateSchema = exports.categorySchema.partial().extend({
// Allow partial updates
});
