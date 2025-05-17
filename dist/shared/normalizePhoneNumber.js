"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhoneNumber = void 0;
const normalizePhoneNumber = (phone) => {
    // Remove any non-digit characters
    let normalizedPhone = phone.replace(/\D/g, "");
    // Add country code if missing
    if (normalizedPhone.startsWith("0")) {
        normalizedPhone = "+880" + normalizedPhone.slice(1);
    }
    else if (normalizedPhone.startsWith("880")) {
        normalizedPhone = "+880" + normalizedPhone.slice(3);
    }
    else if (!normalizedPhone.startsWith("+880")) {
        normalizedPhone = "+880" + normalizedPhone;
    }
    return normalizedPhone;
};
exports.normalizePhoneNumber = normalizePhoneNumber;
