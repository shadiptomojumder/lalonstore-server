"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CategorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50,
        index: true,
    },
    value: {
        type: String,
        required: true,
        unique: true,
    },
    logo: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
}, {
    timestamps: true, // Automatically manages createdAt and updatedAt
});
CategorySchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v; // Optional: remove __v
    },
});
const Category = mongoose_1.default.model("Category", CategorySchema);
exports.default = Category;
