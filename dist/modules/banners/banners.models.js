"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerImage = exports.Banner = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BannerSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    order: {
        type: Number,
        unique: true, // Prevents duplicate order values
        index: true, // Improves sorting performance
        default: 0, // To be assigned dynamically when creating a banner
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
BannerSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v; // Optional: remove __v
    },
});
exports.Banner = mongoose_1.default.model("Banner", BannerSchema);
const BannerImageSchema = new mongoose_1.default.Schema({
    images: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
BannerImageSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v; // Optional: remove __v
    },
});
exports.BannerImage = mongoose_1.default.model("BannerImage", BannerSchema);
