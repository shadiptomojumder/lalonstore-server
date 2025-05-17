"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
// Product validation schema
exports.productSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Product name is required" })
        .max(255, { message: "Product name must be less than 255 characters" }),
    price: zod_1.z.any(),
    discount: zod_1.z
        .number()
        .min(0, { message: "Discount must be between 0 and 100" })
        .max(100, { message: "Discount must be between 0 and 100" })
        .optional(), // Discount is optional
    finalPrice: zod_1.z
        .number()
        .positive({ message: "Final price must be a positive number" })
        .optional(),
    quantity: zod_1.z
        .string()
        .min(1, { message: "Quantity is required" })
        .max(50, { message: "Quantity should not exceed 50 characters" }),
    description: zod_1.z
        .string()
        .max(1000, { message: "Description should not exceed 1000 characters" })
        .optional(),
    stock: zod_1.z
        .number()
        .min(0, { message: "Stock must be a positive number" })
        .optional(),
    images: zod_1.z.any().optional(),
    sku: zod_1.z
        .string()
        .min(1, { message: "SKU is required" })
        .max(50, { message: "SKU should not exceed 50 characters" })
        .optional(),
    isActive: zod_1.z.boolean().optional(),
    isWeekendDeal: zod_1.z.boolean().optional(),
    isFeatured: zod_1.z.boolean().optional(),
    category: zod_1.z.string().min(1, { message: "Category is required" }),
});
// Product Update Schema (to handle updates)
exports.productUpdateSchema = exports.productSchema.partial().extend({
// Allow partial updates
});
