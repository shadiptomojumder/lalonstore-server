import app from "../src/app";
import connectDB from "../src/db/dbConnection";

let isConnected = false;

export default async function handler(req, res) {
    if (!isConnected) {
        try {
            await connectDB();
            isConnected = true;
            console.log("MongoDB Connected inside Vercel function!");
        } catch (error) {
            console.error("MongoDB connection failed:", error);
            return res
                .status(500)
                .json({ message: "Database connection failed" });
        }
    }

    // Now pass the request to Express app
    app(req, res);
}
