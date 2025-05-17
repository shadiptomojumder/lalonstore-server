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
exports.deleteLocalFiles = deleteLocalFiles;
const promises_1 = __importDefault(require("fs/promises"));
function deleteLocalFiles(filePaths) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Convert single file path to an array for consistency
            const files = Array.isArray(filePaths) ? filePaths : [filePaths];
            // Use Promise.allSettled to handle individual file deletions
            const results = yield Promise.allSettled(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield promises_1.default.unlink(file);
                    console.log(`Deleted: ${file}`);
                }
                catch (error) {
                    console.error(`Failed to delete ${file}:`, error);
                }
            })));
            // Optional: Return failed deletions
            const failedFiles = results
                .filter(result => result.status === "rejected")
                .map((result, index) => files[index]);
            if (failedFiles.length > 0) {
                console.error("Some files could not be deleted:", failedFiles);
            }
        }
        catch (error) {
            console.error("Unexpected error deleting files:", error);
        }
    });
}
// Usage examples:
// Deleting a single file
// deleteFiles("path/to/file1.jpg");
// Deleting multiple files
// deleteFiles(["path/to/file1.jpg", "path/to/file2.jpg", "path/to/file3.jpg"]);
