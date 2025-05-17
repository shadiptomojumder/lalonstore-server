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
exports.bannersController = void 0;
const ApiResponse_1 = __importDefault(require("../../shared/ApiResponse"));
const asyncErrorHandler_1 = __importDefault(require("../../shared/asyncErrorHandler"));
const http_status_codes_1 = require("http-status-codes");
const banners_services_1 = require("./banners.services");
// Controller function to create a new Banner
const createBanner = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banners_services_1.BannerService.createBanner(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Banner Successfully Created",
        data: result,
    });
}));
// Controller function to update an existing category
const updateBanner = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banners_services_1.BannerService.updateBanner(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Banner successfully updated",
        data: result,
    });
}));
// Controller function to get all categories
const getAllBanners = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banners_services_1.BannerService.getAllBanners(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All Banners fetched",
        data: result,
    });
}));
// Controller function to delete a category by ID
const deleteBanners = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banners_services_1.BannerService.deleteBanners(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `${result.message}`,
    });
}));
// Controller function for Delete a single banner
const deleteSingleBanner = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banners_services_1.BannerService.deleteSingleBanner(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.message,
    });
}));
// Controller function for Delete multiple banners
const deleteMultipleBanners = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banners_services_1.BannerService.deleteMultipleBanners(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: result.message,
    });
}));
// Controller function to delete a category by ID
const getBannerById = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banners_services_1.BannerService.getBannerById(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Banner Found",
        data: result,
    });
}));
// Controller function to upload Banner Images
const uploadBannerImages = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banners_services_1.BannerService.uploadBannerImages(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Images uploaded successfully.",
        data: result,
    });
}));
// Controller function to upload Banner Images
const getBannerImages = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banners_services_1.BannerService.getBannerImages();
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Images fetched successfully.",
        data: result,
    });
}));
exports.bannersController = {
    createBanner,
    updateBanner,
    getAllBanners,
    deleteBanners,
    deleteSingleBanner,
    deleteMultipleBanners,
    getBannerById,
    uploadBannerImages,
    getBannerImages
};
