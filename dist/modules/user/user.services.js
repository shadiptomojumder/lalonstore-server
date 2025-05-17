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
exports.UserServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const normalizePhoneNumber_1 = require("../../shared/normalizePhoneNumber");
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("./user.model");
const user_schemas_1 = require("./user.schemas");
const extractCloudinaryPublicId_1 = require("../../shared/extractCloudinaryPublicId");
const cloudinary_1 = require("../../shared/cloudinary");
const getOneUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the user by ID
        const user = yield user_model_1.User.findById(userId)
            .select("-password -refreshToken")
            .lean()
            .exec();
        if (!user)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User does not exist");
        return user;
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
const getAllUser = (filters, options, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
        // console.log("40.filters is:", filters);
        // auth role base logic here
        const andConditions = [];
        // Apply filters
        if (Object.keys(filters).length > 0) {
            Object.keys(filters).forEach((key) => {
                if (key === "fullname") {
                    // Case-insensitive partial match for fullname
                    andConditions.push({
                        [key]: { $regex: filters[key], $options: "i" },
                    });
                }
                else {
                    // Exact match for other fields
                    andConditions.push({
                        [key]: filters[key],
                    });
                }
            });
        }
        // Debug: Log the constructed where conditions
        // console.log(
        //   "Constructed where conditions:",
        //   JSON.stringify(andConditions, null, 2)
        // );
        // Combine all conditions
        const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
        // Query the database
        const result = yield user_model_1.User.find(whereConditions)
            .skip(skip)
            .limit(limit)
            .sort(options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder === "asc" ? 1 : -1 }
            : { createdAt: 1 })
            .exec();
        const total = yield user_model_1.User.countDocuments(whereConditions);
        return {
            meta: {
                total,
                page,
                limit,
            },
            data: result,
        };
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
const updateUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Product Id
        const { userId } = req.params;
        console.log("User Id: ", userId);
        console.log("Request Body Is: ", req.body);
        const file = req.file;
        // Fetch user from the database to determine their signup method
        const existingUser = yield user_model_1.User.findById(userId);
        if (!existingUser) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        // Validate the request body against the product schema
        const parseBody = user_schemas_1.updateUserSchema.safeParse(req.body);
        console.log("The parseBody is:", parseBody);
        // If validation fails, collect error messages and throw a BAD_REQUEST error
        if (!parseBody.success) {
            const errorMessages = parseBody.error.errors
                .map((error) => error.message)
                .join(",");
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, errorMessages);
        }
        // Allowed fields for update
        const allowedFields = [
            "avatar",
            "phone",
            "email",
            "address",
            "firstName",
            "lastName",
            "role",
        ];
        // Filter out unwanted fields
        const updateData = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });
        // Prevent changing the signup field
        if (existingUser.email && updateData.email) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You cannot change your registered email");
        }
        if (existingUser.phone && updateData.phone) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You cannot change your registered phone number");
        }
        // Normalize phone number if provided
        if (updateData.phone) {
            updateData.phone = (0, normalizePhoneNumber_1.normalizePhoneNumber)(updateData.phone);
        }
        // Handle image update
        if (file) {
            // Delete old image from Cloudinary
            if (existingUser.avatar) {
                const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(existingUser.avatar);
                yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
            }
            // Upload new thumbnail
            const result = yield (0, cloudinary_1.uploadSingleOnCloudinary)(file.path, "users");
            if (result === null || result === void 0 ? void 0 : result.secure_url)
                updateData.avatar = result.secure_url;
        }
        // Update user
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, updateData, {
            new: true, // Return updated document
            runValidators: true, // Run Mongoose validators
        });
        return updatedUser;
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
exports.UserServices = {
    getOneUser,
    getAllUser,
    updateUser,
};
