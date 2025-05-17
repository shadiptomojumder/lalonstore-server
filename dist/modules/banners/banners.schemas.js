"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerUpdateSchema = exports.bannerSchema = void 0;
const zod_1 = require("zod");
// banner validation schema
exports.bannerSchema = zod_1.z.object({
    order: zod_1.z.number().optional(),
    image: zod_1.z.any().optional(),
    isActive: zod_1.z.boolean().optional(),
});
// Banner Update Schema (to handle updates)
exports.bannerUpdateSchema = exports.bannerSchema.partial().extend({
// Allow partial updates
});
