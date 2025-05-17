"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRoutes = void 0;
const multer_middleware_1 = require("../../middlewares/multer.middleware");
const express_1 = __importDefault(require("express"));
const banners_controller_1 = require("./banners.controller");
const router = express_1.default.Router();
// Create a new banner with an image upload
router.post("", multer_middleware_1.upload.single("image"), banners_controller_1.bannersController.createBanner);
// Update an existing banner (image update is optional)
router.patch("/:bannerId", multer_middleware_1.upload.single("image"), banners_controller_1.bannersController.updateBanner);
// Get all Banners
router.get("", banners_controller_1.bannersController.getAllBanners);
// Get a specific banner by ID
// router.get("/:bannerId", bannersController.getBannerById);
// Get a specific banner by ID
router.post("/images", multer_middleware_1.upload.array("images", 10), banners_controller_1.bannersController.uploadBannerImages);
router.get("/images", banners_controller_1.bannersController.getBannerImages);
// Delete Banner by ID
router.delete("/:bannerId", banners_controller_1.bannersController.deleteSingleBanner);
// Delete Multiple Banners
router.delete("", banners_controller_1.bannersController.deleteMultipleBanners);
exports.BannerRoutes = router;
