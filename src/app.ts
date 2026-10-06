import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import config from "./config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import routes from "./routes";

const app: Application = express();

// ✅ Add this line before using express-rate-limit
app.set("trust proxy", 1); // Trust first proxy (like Vercel, Heroku, etc.)

// Apply security middlewares
app.use(helmet());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // Limit each IP to 1000 requests per window
        standardHeaders: true,
        legacyHeaders: false,
    })
);

// CORS configuration
const corsOptions: cors.CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        // Allow requests with no origin (server-to-server, curl, mobile apps, Postman)
        if (!origin || config.allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Register API route with versioning
app.use("/api/v1", routes);

// Test endpoint to verify server is working
if (config.env !== "production") {
    app.get("/test", (_req: Request, res: Response) => {
        res.status(200).json({
            message: "🚀 Lalon Store Testing API is working.",
        });
    });
}

app.get("/", (_req: Request, res: Response) => {
    res.send("🚀 Lalon Store Server is running..!");
});

// 404 handler MUST come before the global error handler
app.use((req: Request, res: Response, _next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API Not Found",
            },
        ],
    });
});

// Global error handler — must be last
app.use(globalErrorHandler);

export default app;
