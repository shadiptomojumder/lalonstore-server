"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const multer_middleware_1 = require("../../middlewares/multer.middleware");
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const router = express_1.default.Router();
// Create a new Product
router.post("", multer_middleware_1.upload.array("images", 10), product_controller_1.productController.createProduct);
// Update a Product
router.patch("/:productId", multer_middleware_1.upload.array("images", 10), product_controller_1.productController.updateProduct);
// Delete product images
router.delete("/:productId/image", product_controller_1.productController.deleteProductImage);
// Get all products with filters
router.get("", product_controller_1.productController.getAllProduct);
// Get a single product by ID
router.get("/:productId", product_controller_1.productController.getProductById);
// Delete Single product by ID
router.delete("/:productId", product_controller_1.productController.deleteSingleProduct);
// Delete Multiple products
router.delete("", product_controller_1.productController.deleteMultipleProducts);
exports.ProductRoutes = router;
