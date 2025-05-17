"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Define the pick function with generic types T and k
const pick = (obj, // The source object from which to pick properties
keys // An array of keys to pick from the source object
) => {
    // Initialize an empty object to store the picked properties
    const finalObj = {};
    // Iterate over the array of keys
    for (const key of keys) {
        // Check if the key exists in the source object
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            // Add the key and its value to the final object
            finalObj[key] = obj[key];
        }
    }
    // Return the final object containing the picked properties
    return finalObj;
};
// Export the pick function as the default export
exports.default = pick;
