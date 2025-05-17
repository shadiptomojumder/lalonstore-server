"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploads_controller_1 = require("./uploads.controller");
const multer_middleware_1 = require("../../middlewares/multer.middleware");
const router = express_1.default.Router();
// Create a new category
router.post("", multer_middleware_1.upload.array("images", 10), uploads_controller_1.UploadController.uploadFiles);
exports.UploadRoutes = router;
