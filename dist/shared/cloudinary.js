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
exports.deleteFromCloudinary = exports.uploadMultipleOnCloudinaryBase64 = exports.uploadMultipleOnCloudinary = exports.uploadSingleOnCloudinaryBase64 = exports.uploadSingleOnCloudinary = void 0;
const config_1 = __importDefault(require("../config"));
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises")); // Use async file system methods for better performance
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret,
});
const uploadSingleOnCloudinary = (localFilePath, folderName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!localFilePath)
        return null;
    try {
        const response = yield cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: folderName || "others", // Use provided folderName or default,
        });
        return response;
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload file to Cloudinary");
    }
    finally {
        try {
            yield promises_1.default.unlink(localFilePath); // Asynchronous file deletion
        }
        catch (unlinkError) {
            console.warn("Failed to delete local file:", unlinkError);
        }
    }
});
exports.uploadSingleOnCloudinary = uploadSingleOnCloudinary;
const uploadSingleOnCloudinaryBase64 = (base64) => __awaiter(void 0, void 0, void 0, function* () {
    if (!base64)
        return null;
    try {
        return yield cloudinary_1.v2.uploader.upload(base64, {
            resource_type: "auto",
            folder: "categories",
        });
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
});
exports.uploadSingleOnCloudinaryBase64 = uploadSingleOnCloudinaryBase64;
// Function to Upload Multiple Files to Cloudinary
const uploadMultipleOnCloudinary = (localFilePaths, folderName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!localFilePaths || localFilePaths.length === 0)
        return [];
    try {
        const uploadPromises = localFilePaths.map((filePath) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield cloudinary_1.v2.uploader.upload(filePath, {
                resource_type: "auto",
                folder: folderName || "others", // Use provided folderName or default,
            });
            return { url: response.secure_url, public_id: response.public_id };
        }));
        const uploadResponses = yield Promise.all(uploadPromises);
        return uploadResponses;
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload files to Cloudinary");
    }
    finally {
        // Delete temporary files after uploading
        const deletePromises = localFilePaths.map((filePath) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield promises_1.default.unlink(filePath);
            }
            catch (unlinkError) {
                console.warn("Failed to delete local file:", unlinkError);
            }
        }));
        yield Promise.all(deletePromises);
    }
});
exports.uploadMultipleOnCloudinary = uploadMultipleOnCloudinary;
// Function to Upload Multiple Base64 Images to Cloudinary
const uploadMultipleOnCloudinaryBase64 = (base64Images) => __awaiter(void 0, void 0, void 0, function* () {
    if (!base64Images || base64Images.length === 0)
        return [];
    try {
        const uploadPromises = base64Images.map((base64) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield cloudinary_1.v2.uploader.upload(base64, {
                resource_type: "auto",
                folder: "products", // Store in a specific folder
            });
            return { url: response.secure_url, public_id: response.public_id };
        }));
        const uploadResponses = yield Promise.all(uploadPromises);
        return uploadResponses;
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload images to Cloudinary");
    }
});
exports.uploadMultipleOnCloudinaryBase64 = uploadMultipleOnCloudinaryBase64;
const deleteFromCloudinary = (publicIdOrIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicIds = Array.isArray(publicIdOrIds)
            ? publicIdOrIds
            : [publicIdOrIds]; // Convert single string to an array
        if (publicIds.length === 0) {
            throw new Error("Public IDs array is required for deletion.");
        }
        const results = yield Promise.all(publicIds.map((publicId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield cloudinary_1.v2.uploader.destroy(publicId);
                if (result.result !== "ok") {
                    throw new Error(`Failed to delete image: ${publicId}`);
                }
                return { publicId, success: true, result };
            }
            catch (error) {
                return { publicId, success: false, error: error.message };
            }
        })));
        const successResults = results.filter((r) => r.success);
        const errors = results.filter((r) => !r.success).map((r) => r.error);
        if (errors.length > 0) {
            console.error("Some images failed to delete:", errors);
        }
        return { success: errors.length === 0, results: successResults, errors };
    }
    catch (error) {
        console.error("Cloudinary delete error:", error.message);
        return { success: false, errors: [error.message] };
    }
});
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.default = cloudinary_1.v2; // ✅ Export the configured instance
