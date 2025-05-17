"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCloudinaryPublicId = void 0;
const extractCloudinaryPublicId = (url) => {
    const parts = url.split("/");
    const filenameWithExt = parts.pop() || ""; // Get last part (e.g., "image_name.jpg")
    const folder = parts.slice(7).join("/"); // Extract folder structure if any
    const filename = filenameWithExt === null || filenameWithExt === void 0 ? void 0 : filenameWithExt.split(".")[0]; // Remove file extension
    return folder ? `${folder}/${filename}` : filename; // Return full public ID
};
exports.extractCloudinaryPublicId = extractCloudinaryPublicId;
