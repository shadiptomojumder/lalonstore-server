import ApiResponse from "@/shared/ApiResponse";
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

// Validation middleware
export const validateSchema =
    (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
        // parse request body
        const { success, error } = schema.safeParse(req.body);

        // handle non-compliant request body
        if (!success) {
            ApiResponse(res, {
                statusCode: 400,
                success: false,
                message: error.issues
                    .map((issue) => {
                        const path = issue.path.map(String).join(".");
                        return `${path}: ${issue.message}`;
                    })
                    .join(", "),
            });
            next(error);
        }

        next();
    };
