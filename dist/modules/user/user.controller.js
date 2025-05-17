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
exports.UserController = void 0;
const ApiResponse_1 = __importDefault(require("../../shared/ApiResponse"));
const asyncErrorHandler_1 = __importDefault(require("../../shared/asyncErrorHandler"));
const pick_1 = __importDefault(require("../../shared/pick"));
const user_services_1 = require("./user.services");
const user_utils_1 = require("./user.utils");
const http_status_codes_1 = require("http-status-codes");
// Controller function to get the profile of the authenticated user
const getOneUser = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield user_services_1.UserServices.getOneUser(userId);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Profile data fetched!",
        data: result,
    });
}));
// Controller function to get all user
const getAllUser = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract filters from the query parameters using the pick function and userFilterAbleFields array
    const filters = (0, pick_1.default)(req.query, user_utils_1.userFilterAbleFields);
    const options = (0, pick_1.default)(req.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const user = req.user;
    const result = yield user_services_1.UserServices.getAllUser(filters, options, user);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All user retrieval successfully",
        meta: result.meta,
        data: result.data,
    });
}));
// Controller function to update an User
const updateUser = (0, asyncErrorHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.updateUser(req);
    (0, ApiResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User successfully updated",
        data: result,
    });
}));
exports.UserController = {
    getOneUser,
    getAllUser,
    updateUser
};
