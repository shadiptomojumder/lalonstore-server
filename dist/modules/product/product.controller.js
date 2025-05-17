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
exports.productController = void 0;
const ApiResponse_1 = __importDefault(require("../../shared/ApiResponse"));
const asyncErrorHandler_1 = __importDefault(require("../../shared/asyncErrorHandler"));
const pick_1 = __importDefault(require("../../shared/pick"));
const http_status_codes_1 = require("http-status-codes");
const product_services_1 = require("./product.services");
const product_utils_1 = require("./product.utils");
// Controller function to create a new product
const createProduct = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_services_1.ProductService.createProduct(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product Successfully Created",
        data: product,
    });
}));
// Controller function to update an existing product
const updateProduct = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_services_1.ProductService.updateProduct(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product successfully updated",
        data: product,
    });
}));
// Controller function to get all products with filters
const getAllProduct = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract filters from the query parameters using the pick function and userFilterAbleFields array
    const filters = (0, pick_1.default)(req.query, product_utils_1.productFilterAbleFields);
    const options = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const user = req.user;
    const result = yield product_services_1.ProductService.getAllProduct(filters, options, user);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All products retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
// Controller function to get a single product by ID
const getProductById = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_services_1.ProductService.getProductById(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product retrieved successfully",
        data: product,
    });
}));
// Controller function to delete a single product
const deleteSingleProduct = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductService.deleteSingleProduct(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.message,
    });
}));
// Controller function to delete multiple products
const deleteMultipleProducts = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductService.deleteMultipleProducts(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.message,
    });
}));
// Controller function to delete product image
const deleteProductImage = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductService.deleteProductImage(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `${result.message}`,
    });
}));
exports.productController = {
    createProduct,
    updateProduct,
    getAllProduct,
    getProductById,
    deleteSingleProduct,
    deleteMultipleProducts,
    deleteProductImage
};
