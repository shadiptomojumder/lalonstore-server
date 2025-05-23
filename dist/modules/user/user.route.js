"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const multer_middleware_1 = require("../../middlewares/multer.middleware");
const user_controller_1 = require("./user.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//  auth(ENUM_USER_ROLE.ADMIN)
// Route to get all users
router.get("/all", user_controller_1.UserController.getAllUser);
// Route to get a user by ID
router.get("/:id", user_controller_1.UserController.getOneUser);
// Route to Update an User
router.patch("/:userId", multer_middleware_1.upload.single("avatar"), user_controller_1.UserController.updateUser);
exports.UserRoutes = router;
