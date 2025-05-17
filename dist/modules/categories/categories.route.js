"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const categories_controller_1 = require("./categories.controller");
const multer_middleware_1 = require("../../middlewares/multer.middleware");
const router = express_1.default.Router();
// Create a new category with an optional thumbnail upload
// router.post("",upload.single("thumbnail"), categoriesController.createCategory);
// Create a new category with optional thumbnail and logo uploads
router.post("", multer_middleware_1.upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "logo", maxCount: 1 }]), categories_controller_1.categoriesController.createCategory);
// Get all categories
router.get("", categories_controller_1.categoriesController.getAllCategory);
// Get a specific category by ID
router.get("/:categoryId", categories_controller_1.categoriesController.getCategoryById);
// Update a category (thumbnail update is optional)
router.patch("/:categoryId", multer_middleware_1.upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "logo", maxCount: 1 }]), categories_controller_1.categoriesController.updateCategory);
// Delete Single Category by ID
router.delete("/:categoryId", categories_controller_1.categoriesController.deleteSingleCategory);
// Delete Multiple Categories
router.delete("", categories_controller_1.categoriesController.deleteMultipleCategories);
exports.CategoryRoutes = router;
