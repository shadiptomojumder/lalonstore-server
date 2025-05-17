"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        required: true,
        default: 0.0,
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
    },
    finalPrice: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        default: 0.0,
    },
    quantity: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    images: {
        type: [String],
        default: [],
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    isWeekendDeal: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
}, {
    timestamps: true,
});
ProductSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        ret.price = parseFloat(ret.price.toString());
        ret.finalPrice = parseFloat(ret.finalPrice.toString());
        delete ret._id;
        delete ret.__v; // Optional: remove __v
    },
});
ProductSchema.index({ name: 1 }); // Text Search Optimization
ProductSchema.index({ category: 1 }); // Faster Category Lookups
ProductSchema.index({ price: 1 }); // Price-based Filtering Optimization
ProductSchema.index({ createdAt: -1 }); // Sorting Optimization
const Product = mongoose_1.default.model("Product", ProductSchema);
exports.default = Product;
