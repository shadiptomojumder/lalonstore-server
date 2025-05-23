"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse = (res, data) => {
    const responseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: data.meta || null,
        data: data.data || null,
    };
    res.status(data.statusCode).json(responseData);
};
exports.default = ApiResponse;
