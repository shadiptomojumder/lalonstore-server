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
exports.categoriesController = void 0;
const ApiResponse_1 = __importDefault(require("../../shared/ApiResponse"));
const asyncErrorHandler_1 = __importDefault(require("../../shared/asyncErrorHandler"));
const http_status_codes_1 = require("http-status-codes");
const categories_services_1 = require("./categories.services");
// Controller function to create a new category
const createCategory = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_services_1.CategoryService.createCategory(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category created successfully",
        data: result,
    });
}));
// Controller function to update an existing category
const updateCategory = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_services_1.CategoryService.updateCategory(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
}));
// Controller function to get all categories
const getAllCategory = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_services_1.CategoryService.getAllCategory(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
    });
}));
// Controller function for Delete a single category
const deleteSingleCategory = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_services_1.CategoryService.deleteSingleCategory(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.message,
    });
}));
// Controller function for Delete multiple categories
const deleteMultipleCategories = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_services_1.CategoryService.deleteMultipleCategories(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.message,
    });
}));
// Controller function to delete a category by ID
const getCategoryById = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categories_services_1.CategoryService.getCategoryById(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category details retrieved successfully",
        data: result,
    });
}));
exports.categoriesController = {
    createCategory,
    updateCategory,
    getAllCategory,
    deleteSingleCategory,
    deleteMultipleCategories,
    getCategoryById,
};
