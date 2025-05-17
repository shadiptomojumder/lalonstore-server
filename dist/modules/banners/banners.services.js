"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.BannerService = void 0;
const cloudinary_1 = __importStar(require("../../shared/cloudinary"));
const extractCloudinaryPublicId_1 = require("../../shared/extractCloudinaryPublicId");
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const mongoose_1 = __importDefault(require("mongoose"));
const banners_models_1 = require("./banners.models");
const banners_schemas_1 = require("./banners.schemas");
// Function to create a new Banner
const createBanner = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Determine the order for the new banner (last in sequence)
        const lastBanner = yield banners_models_1.Banner.findOne().sort({ order: -1 });
        const newOrder = lastBanner ? lastBanner.order + 1 : 1;
        // Create a new Banner in the database
        const banner = yield banners_models_1.Banner.create({
            title: `Banner #${newOrder}`,
            image: "",
            order: newOrder,
        });
        return banner;
    }
    catch (error) {
        console.log("The createBanner Error is:", error);
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
// Function to update an existing Banner
const updateBanner = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Banner Id
        const { bannerId } = req.params;
        // Validate the request body against the Banner update schema
        const parseBody = banners_schemas_1.bannerUpdateSchema.safeParse(req.body);
        // If validation fails, collect error messages and throw a BAD_REQUEST error
        if (!parseBody.success) {
            const errorMessages = parseBody.error.errors
                .map((error) => error.message)
                .join(",");
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, errorMessages);
        }
        // Find the existing category
        const existingBanner = yield banners_models_1.Banner.findById(bannerId);
        if (!existingBanner) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Banner not found");
        }
        // Update the banner with the provided data
        const updatedBanner = yield banners_models_1.Banner.findByIdAndUpdate(bannerId, {
            image: parseBody.data.image,
            isActive: parseBody.data.isActive,
        });
        return updatedBanner;
    }
    catch (error) {
        console.log("Update Banner Error: ", error);
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
// Function to get all banners
const getAllBanners = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all banners with all fields from the database
        const banners = yield banners_models_1.Banner.find();
        if (!banners) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "banners not found!!");
        }
        return banners;
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
// Function to get a single banner by ID
const getBannerById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Banner Id
        const { bannerId } = req.params;
        // ✅ Check if bannerId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(bannerId)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid banner ID");
        }
        // Retrieve the banner with the specified ID from the database
        const banner = yield banners_models_1.Banner.findById(bannerId);
        // If the banner is not found, throw a NOT_FOUND error
        if (!banner) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Banner not found");
        }
        return banner;
    }
    catch (error) {
        console.log("GetBannerById Error:", error);
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
// Function to delete a banner by ID
const deleteBanners = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bannerId } = req.params;
        const { ids } = req.body;
        if (bannerId) {
            // Find the Banner to get the image (if exists)
            const banner = yield banners_models_1.Banner.findById(bannerId);
            if (!banner) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Banner not found");
            }
            // First, delete the Banner from the database
            const deletedBanner = yield banners_models_1.Banner.findByIdAndDelete(bannerId);
            if (!deletedBanner) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete Banner from database");
            }
            // Delete image from Cloudinary if the banner has a image
            if (banner.image) {
                const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(banner.image);
                yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
            }
            return { message: "Banner deleted successfully" };
        }
        else if (ids && Array.isArray(ids)) {
            // Validate that 'ids' is an array and contains valid values
            if (!Array.isArray(ids) || ids.length === 0) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid request. 'ids' must be a non-empty array");
            }
            // Fetch all banners to ensure they exist
            const existingBanners = yield banners_models_1.Banner.find({
                _id: { $in: ids },
            });
            if (existingBanners.length !== ids.length) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "One or more banner IDs do not exist");
            }
            // Delete banners from database first
            const result = yield banners_models_1.Banner.deleteMany({ _id: { $in: ids } });
            console.log("The delete result is:", result);
            if (result.deletedCount !== ids.length) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Some banners could not be deleted");
            }
            console.log("The delete result is:", result);
            console.log("The existingBanners is:", existingBanners);
            // ✅ Delete associated images from Cloudinary
            yield Promise.all(existingBanners.map((banner) => __awaiter(void 0, void 0, void 0, function* () {
                if (banner.image) {
                    const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(banner.image);
                    yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
                }
            })));
            return {
                message: `${result.deletedCount} banners deleted successfully`,
            };
        }
        else {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid request");
        }
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
// Function to delete a single banner by ID
const deleteSingleBanner = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bannerId } = req.params;
        if (!bannerId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Banner ID is required");
        }
        const banner = yield banners_models_1.Banner.findById(bannerId);
        if (!banner) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Banner not found");
        }
        const deletedBanner = yield banners_models_1.Banner.findByIdAndDelete(bannerId);
        if (!deletedBanner) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete banner from database");
        }
        if (banner.image) {
            const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(banner.image);
            yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
        }
        return { message: "Banner deleted successfully" };
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred while deleting the banner");
    }
});
// Function to delete multiple banners by IDs
const deleteMultipleBanners = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "'ids' must be a non-empty array");
        }
        const existingBanners = yield banners_models_1.Banner.find({ _id: { $in: ids } });
        if (existingBanners.length !== ids.length) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "One or more banner IDs do not exist");
        }
        const result = yield banners_models_1.Banner.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount !== ids.length) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Some banners could not be deleted");
        }
        yield Promise.all(existingBanners.map((banner) => __awaiter(void 0, void 0, void 0, function* () {
            if (banner.image) {
                const publicId = (0, extractCloudinaryPublicId_1.extractCloudinaryPublicId)(banner.image);
                yield (0, cloudinary_1.deleteFromCloudinary)(publicId);
            }
        })));
        return {
            message: `${result.deletedCount} banners deleted successfully`,
        };
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred while deleting banners");
    }
});
// Function to create a new product
const uploadBannerImages = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If user dont send any image then show an error
        if (!req.files || req.files.length === 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "At least one image is required to create a product.");
        }
        // Generate an array of strings for file path
        const filePaths = req.files.map((file) => file.path);
        // Upload images to Cloudinary
        const uploadResults = yield (0, cloudinary_1.uploadMultipleOnCloudinary)(filePaths, "banners");
        // Transform it into an array of URLs
        const imageUrls = uploadResults.map((image) => image.url);
        console.log("The imageUrls  is:", imageUrls);
        return imageUrls;
    }
    catch (error) {
        console.error("Error in createProduct:", error);
        if (error instanceof ApiError_1.default)
            throw error;
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
});
const getBannerImages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.default.api.resources({
            type: "upload",
            prefix: "banners/", // Fetch only images from 'banners' folder
            resource_type: "image", // Ensure only images are retrieved
            max_results: 50, // Limit number of images
        });
        console.log("The result is:", result);
        return result.resources.map((file) => ({
            imageURL: file.secure_url,
            public_id: file.public_id,
        }));
    }
    catch (error) {
        console.error("Error fetching banner images:", error);
        throw new Error("Failed to fetch images from Cloudinary");
    }
});
exports.BannerService = {
    createBanner,
    updateBanner,
    getAllBanners,
    deleteBanners,
    deleteSingleBanner,
    deleteMultipleBanners,
    getBannerById,
    uploadBannerImages,
    getBannerImages,
};
