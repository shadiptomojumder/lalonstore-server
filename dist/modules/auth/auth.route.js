"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const auth_controller_1 = require("./auth.controller");
const express_1 = __importDefault(require("express"));
// Create a new Express router
const router = express_1.default.Router();
// Define the signup route
router.post("/signup", auth_controller_1.AuthController.signup);
// Define the login route
router.post("/login", auth_controller_1.AuthController.login);
// Define the logout route
router.post("/logout", auth_controller_1.AuthController.logout);
exports.AuthRoutes = router;
