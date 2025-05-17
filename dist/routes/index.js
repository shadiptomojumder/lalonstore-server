"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const banners_route_1 = require("../modules/banners/banners.route");
const categories_route_1 = require("../modules/categories/categories.route");
const product_route_1 = require("../modules/product/product.route");
const uploads_route_1 = require("../modules/uploads/uploads.route");
const user_route_1 = require("../modules/user/user.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/products",
        route: product_route_1.ProductRoutes,
    },
    {
        path: "/categories",
        route: categories_route_1.CategoryRoutes,
    },
    {
        path: "/banners",
        route: banners_route_1.BannerRoutes,
    },
    {
        path: "/uploads",
        route: uploads_route_1.UploadRoutes,
    },
];
// Register each route and log it using console
moduleRoutes.forEach((route) => {
    try {
        router.use(route.path, route.route);
        console.log(`Route registered: ${route.path}`);
    }
    catch (error) {
        console.error(`Error registering route ${route.path}:`, error);
    }
});
// Handle 404 errors if no routes match
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `No API route found for ${req.originalUrl}`,
    });
    console.warn(`404 Not Found: ${req.originalUrl}`);
});
// Middleware for logging requests
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`Request: ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});
exports.default = router;
