import { z } from "zod";

// Regex patterns for phone number validation Bangladesh only
const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/; 

// Schema for validating signup data in auth services
export const signupDataSchema = z.object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.string().email("Invalid email address").optional(),
    phone: z
        .string()
        .optional()
        .nullable()
        .refine((value) => !value || bdPhoneRegex.test(value), {
            message: "Invalid Bangladeshi phone number. Use format: +8801XXXXXXXXX or 01XXXXXXXXX",
          }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .nonempty("Password is required"),
});

// Schema for validating login data in auth services
export const loginDataSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});
