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
exports.CategoryService = void 0;
const cloudinary_1 = require("../../shared/cloudinary");
const deleteLocalFiles_1 = require("../../shared/deleteLocalFiles");
const extractCloudinaryPublicId_1 = require("../../shared/extractCloudinaryPublicId");
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const categories_models_1 = __importDefault(require("./categories.models"));
const categories_schemas_1 = require("./categories.schemas");
// Function to create a new category
const createCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body against the category schema
        const parseBody = categories_schemas_1.categorySchema.safeParse(req.body);
        // Check if the request contains files
        const files = req.files;
        // If validation fails, collect error messages and throw a BAD_REQUEST error
        if (!parseBody.success) {
            const errorMessages = parseBody.error.errors
                .map((error) => error.message)
                .join(",");
            // Delete the locally stored file before throwing an error
            const pathsToDelete = [];
            if (files["thumbnail"])
                pathsToDelete.push(files["thumbnail"][0].path);
            if (files["logo"])
                pathsToDelete.push(files["logo"][0].path);
            (0, deleteLocalFiles_1.deleteLocalFiles)(pathsToDelete);
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, errorMessages);
        }
        // Check if the category images are provided
        if (!files || !files["thumbnail"] || !files["logo"]) {
            const pathsToDelete = [];
            if (files["thumbnail"])
                pathsToDelete.push(files["thumbnail"][0].path);
            if (files["logo"])
                pathsToDelete.push(files["logo"][0].path);
            (0, deleteLocalFiles_1.deleteLocalFiles)(pathsToDelete);
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Both thumbnail and logo images are required");
        }
        // Generate a unique `value` from `title`
        const generatedValue = parseBody.data.title
            .toLowerCase()
            .replace(/\s+/g, "_") // Convert spaces to underscores
            .replace(/[^a-z0-9_]/g, ""); // Remove special characters
        // Check if a category with the same title or value already exists
        const existingCategory = yield categories_models_1.default.findOne({
            $or: [
                { title: parseBody.data.title }, // Check for duplicate title
                { value: generatedValue }, // Check for duplicate value
            ],
        });
        // If category exists, throw a CONFLICT error
        if (existingCategory) {
            // Delete the locally stored file before throwing an error
            const pathsToDelete = [];
            if (files["thumbnail"])
                pathsToDelete.push(files["thumbnail"][0].path);
            if (files["logo"])
                pathsToDelete.push(files["logo"][0].path);
            (0, deleteLocalFiles_1.deleteLocalFiles)(pathsToDelete);
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Category with this title or value already exists");
        }
        // Upload the thumbnail and logo images to Cloudinary
        let thumbnailUrl = "";
        let logoUrl = "";
        if (files["thumbnail"]) {
            const result = yield (0, cloudinary_1.uploadSingleOnCloudinary)(files["thumbnail"][0].path, "categories");
            thumbnailUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || "";
        }
        if (files["logo"]) {
            const result = yield (0, cloudinary_1.uploadSingleOnCloudinary)(files["logo"][0].path, "categories");
            logoUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || "";
        }
        // Create a new category in the database
        const category = new categories_models_1.default(Object.assign(Object.assign({}, parseBody.data), { value: generatedValue, thumbnail: thumbnailUrl, logo: logoUrl }));
        yield category.save();
        return category;
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error; // Keep the original error's status code
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `An unexpected error occurred while creating the category:${error instanceof Error ? error.message : "Unknown error"}`);
    }
});
// Function to update an existing category
const updateCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Category Id
        const { categoryId } = req.params;
        // Check if the request contains files
        const files = req.files;
        // console.log("The Files in Request:",req.files);
        // Validate the request body against the category update schema
        const parseBody = categories_schemas_1.categoryUpdateSchema.safeParse(req.body);
        // If validation fails, collect error messages and throw a BAD_REQUEST error
        if (!parseBody.success) {
            const errorMessages = parseBody.error.errors
                .map((error) => error.message)
                .join(",");
            const pathsToDelete = [];
            if (files["thumbnail"])
                pathsToDelete.push(files["thumbnail"][0].path);
            if (files["logo"])
                pathsToDelete.push(files["logo"][0].path);
            (0, deleteLocalFiles_1.deleteLocalFiles)(pathsToDelete);
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, errorMessages);
        }
        const { title } = parseBody.data;
        const updateData = Object.assign({}, parseBody.data);
        // Find the existing category
        const existingCategory = yield categories_models_1.default.findById(categoryId);
        if (!existingCategory) {
            const pathsToDelete = [];
            if (files["thumbnail"])
                pathsToDelete.push(files["thumbnail"][0].path);
            if (files["logo"])
                pathsToDelete.push(files["logo"][0].path);
            (0, deleteLocalFiles_1.deleteLocalFiles)(pathsToDelete);
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
        }
        // Check if the title already exists in another category
        if (title) {
            const duplicateCategory = yield categories_models_1.default.findOne({
                title,
                _id: { $ne: categoryId }, // Exclude current category
            });
            if (duplicateCategory) {
                const pathsToDelete = [];
                if (files["thumbnail"])
                    pathsToDelete.push(files["thumbnail"][0].path);
                if (files["logo"])
                    pathsToDelete.push(files["logo"][0].path);
                (0, deleteLocalFiles_1.deleteLocalFiles)(pathsToDelete);
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "A category with this title already exists");
            }
            // Generate `value` from `title`
            updateData.value = title
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_]/g, "");
        }
        // Handle image updates if image is provided
        if (files && (files["thumbnail"] || files["logo"])) {
            const pathsToDelete = [];
            if (files["thumbnail"]) {
                // Delete old thumbnail from Cloudinary
                if (existingCategory.thumbnail) {
                    const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(existingCategory.thumbnail);
                    yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
                }
                // Upload new thumbnail
                const result = yield (0, cloudinary_1.uploadSingleOnCloudinary)(files["thumbnail"][0].path, "categories");
                if (result === null || result === void 0 ? void 0 : result.secure_url)
                    updateData.thumbnail = result.secure_url;
                pathsToDelete.push(files["thumbnail"][0].path);
            }
            if (files["logo"]) {
                // Delete old logo from Cloudinary
                if (existingCategory.logo) {
                    const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(existingCategory.logo);
                    yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
                }
                // Upload new logo
                const result = yield (0, cloudinary_1.uploadSingleOnCloudinary)(files["logo"][0].path, "categories");
                if (result === null || result === void 0 ? void 0 : result.secure_url)
                    updateData.logo = result.secure_url;
                pathsToDelete.push(files["logo"][0].path);
            }
            // Delete the locally stored files after uploading to Cloudinary
            (0, deleteLocalFiles_1.deleteLocalFiles)(pathsToDelete);
        }
        // Update the category
        const updatedCategory = yield categories_models_1.default.findByIdAndUpdate(categoryId, updateData, { new: true });
        if (!updatedCategory)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
        return updatedCategory;
    }
    catch (error) {
        console.log("UpdateCategory Error: ", error);
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `An unexpected error occurred while updating category:${error instanceof Error ? error.message : "Unknown error"}`);
    }
});
// Function to get all categories
const getAllCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all categories with all fields from the database
        const categories = yield categories_models_1.default.find();
        if (!categories) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "categories not found!!");
        }
        return categories;
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `An unexpected error occurred while getting all categories:${error instanceof Error ? error.message : "Unknown error"}`);
    }
});
// Function to get a single category by ID
const getCategoryById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        // Retrieve the category with the specified ID from the database
        const category = yield categories_models_1.default.findById(categoryId);
        // If the category is not found, throw a NOT_FOUND error
        if (!category) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
        }
        return category;
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `An unexpected error occurred while getting category By ID:${error instanceof Error ? error.message : "Unknown error"}`);
    }
});
// Delete a single category By ID
const deleteSingleCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Category ID is required");
        }
        // Validate the productId to ensure it's a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid Category Id: ${categoryId}`);
        }
        const category = yield categories_models_1.default.findById(categoryId);
        if (!category) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
        }
        const deletedCategory = yield categories_models_1.default.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete category");
        }
        // Delete images from Cloudinary if they exist
        const pathsToDelete = [];
        if (category.thumbnail) {
            const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(category.thumbnail);
            yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
            pathsToDelete.push(category.thumbnail);
        }
        if (category.logo) {
            const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(category.logo);
            yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
            pathsToDelete.push(category.logo);
        }
        // Delete the locally stored files
        (0, deleteLocalFiles_1.deleteLocalFiles)(pathsToDelete);
        return { message: "Category deleted successfully" };
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `An unexpected error occurred while deleting the category:${error instanceof Error ? error.message : "Unknown error"}`);
    }
});
// Delete multiple categories
const deleteMultipleCategories = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid request. 'ids' must be a non-empty array");
        }
        // Validate the ids to ensure they're valid ObjectId strings
        const invalidIds = ids.filter((id) => !mongoose_1.default.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid Category Id(s): ${invalidIds.join(", ")}`);
        }
        // Fetch all categories to ensure they exist
        const existingCategories = yield categories_models_1.default.find({
            _id: { $in: ids },
        });
        if (existingCategories.length !== ids.length) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "One or more category IDs do not exist");
        }
        const result = yield categories_models_1.default.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount !== ids.length) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Some categories could not be deleted");
        }
        // Delete associated images from Cloudinary
        const pathsToDelete = [];
        for (const category of existingCategories) {
            if (category.thumbnail) {
                const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(category.thumbnail);
                yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
                pathsToDelete.push(category.thumbnail);
            }
            if (category.logo) {
                const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(category.logo);
                yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
                pathsToDelete.push(category.logo);
            }
        }
        return {
            message: `${result.deletedCount} categories deleted successfully`,
        };
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `An unexpected error occurred while deleting categories:${error instanceof Error ? error.message : "Unknown error"}`);
    }
});
exports.CategoryService = {
    createCategory,
    updateCategory,
    getAllCategory,
    deleteSingleCategory,
    deleteMultipleCategories,
    getCategoryById,
};
