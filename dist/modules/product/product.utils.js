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
exports.deleteLocalFiles = exports.generateSku = exports.productFilterAbleFields = exports.generateSkuOld = void 0;
const product_models_1 = __importDefault(require("./product.models"));
const fs_1 = __importDefault(require("fs"));
// Generate a SKU based on the product name, category, and an incrementing number (or unique id)
const generateSkuOld = (category, productName) => {
    const categoryCode = category.substring(0, 4).toUpperCase(); // First 4 letters of the category
    const productPrefix = productName.substring(0, 4).toUpperCase(); // First 4 letters of the product name
    const uniqueId = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0"); // Random unique ID
    return `${categoryCode}-${productPrefix}-${uniqueId}`; // Example: "NIKE-AIRM-0012"
};
exports.generateSkuOld = generateSkuOld;
// Product filters
exports.productFilterAbleFields = [
    "id",
    "name",
    "price",
    "stock",
    "sku",
    "category",
    "isActive",
    "isWeekendDeal",
    "isFeatured",
    "createdAt",
    "updatedAt",
];
// Function to generate a unique SKU for a product using the provided category and product name
const generateSku = (category, productName) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryCode = category.substring(0, 3).toUpperCase(); // First 3 letters of category
    const productCode = productName.substring(0, 3).toUpperCase(); // First 3 letters of product name
    const timestamp = Date.now().toString(36).slice(-4); // Unique timestamp (Base36, last 4 chars)
    let uniqueId = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit random number
    let sku = `${categoryCode}-${productCode}-${timestamp}-${uniqueId}`; // Example: "ELE-LAP-X1A3-3456"
    // Ensure SKU is unique in the database
    let existingProduct = yield product_models_1.default.findOne({ sku });
    while (existingProduct) {
        uniqueId = Math.floor(1000 + Math.random() * 9000).toString(); // Generate new random number
        sku = `${categoryCode}-${productCode}-${timestamp}-${uniqueId}`;
        existingProduct = yield product_models_1.default.findOne({ sku }); // Check again
    }
    return sku;
});
exports.generateSku = generateSku;
// Function to delete local files
const deleteLocalFiles = (filePaths) => {
    filePaths.forEach((filePath) => {
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", filePath, err);
            }
            else {
                console.log("Deleted local file:", filePath);
            }
        });
    });
};
exports.deleteLocalFiles = deleteLocalFiles;
