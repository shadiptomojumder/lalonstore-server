"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = process.env.NODE_ENV === 'production'
    ? path_1.default.join(process.cwd(), '.env.prod')
    : path_1.default.join(process.cwd(), '.env');
dotenv_1.default.config({ path: envPath });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    allowedOrigins: ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || [],
    jwt: {
        secret: process.env.JWT_SECRET,
        expires_in: process.env.EXPIRES_IN,
        refresh_secret: process.env.REFRESH_SECRET,
        refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
        passwordResetTokenExpirationTime: process.env.PASS_RESET_EXPIRATION_TIME,
    },
    reset_link: process.env.RESET_LINK,
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
    bycrypt_salt_rounds: process.env.SALT_ROUND,
    ssl: {
        sslPaymentUrl: process.env.SSL_PAYMENT_URL,
        validationUrl: process.env.VALIDATION_URL,
        storeId: process.env.STORE_ID,
        storePass: process.env.STORE_PASSWORD,
        successUrl: process.env.SUCCESS_URL,
        cancelUrl: process.env.CANCEL_URL,
        failUrl: process.env.FAIL_URL,
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    },
};
