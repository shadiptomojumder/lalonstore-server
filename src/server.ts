import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import connectDB from "./db/dbConnection";
import { errorlogger } from "./shared/logger";

let server: Server;
let isShuttingDown = false;

async function startServer() {
    try {
        // Connect to MongoDB database
        await connectDB();

        // Start the HTTP server
        server = app.listen(config.port, () => {
            console.log(
                `🚀 Server running in ${config.env} mode on port ${config.port}`
            );
        });

        // Handle server errors
        server.on("error", (error: NodeJS.ErrnoException) => {
            if (error.code === "EADDRINUSE") {
                console.warn(
                    `⚠️ Port ${config.port} is already in use. Server could not start.`
                );
            } else {
                console.error("❌ Server error:", error);
            }

            gracefulShutdown(1);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);

        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            console.error(
                "❌ Error closing database connection:",
                disconnectError
            );
        }

        errorlogger.error("Failed to start the server:", error);
        process.exit(1);
    }
}

// Function to handle unexpected errors
function unexpectedErrorHandler(error: unknown) {
    console.log("❌ Unexpected error:", error);
    gracefulShutdown(1);
}

// Function to handle Graceful shutdown of server and database connection
function gracefulShutdown(exitCode: number) {
    // Ignore repeat calls (e.g. SIGTERM and an error arriving together)
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;

    console.log("🛑 Shutting down server...");

    // Safety net: force-exit if cleanup hangs. Covers every path below.
    const forceExitTimer = setTimeout(() => {
        console.error("⚠️ Forced shutdown after 10 seconds");
        process.exit(exitCode);
    }, 10_000);

    // Server not started yet (e.g. shutdown during DB connect)
    if (!server) {
        mongoose
            .disconnect()
            .catch((error) => {
                console.error("❌ Error closing database connection:", error);
            })
            .finally(() => {
                clearTimeout(forceExitTimer);
                process.exit(exitCode);
            });

        return;
    }

    server.close(async () => {
        console.log("✅ HTTP server closed");

        try {
            await mongoose.disconnect();

            console.log("✅ Database connection closed");
        } catch (error) {
            console.error("❌ Error closing database connection:", error);
        } finally {
            clearTimeout(forceExitTimer);
            process.exit(exitCode);
        }
    });

    // Drop idle keep-alive connections so shutdown doesn't wait on them
    // (in-flight requests are still allowed to finish). Node 18.2+
    server.closeIdleConnections();
}

// Uncaught errors: log, shut down, exit 1 so the process manager restarts the app.
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// Shutdown signals (deploy, docker stop, Ctrl+C): exit 0.
// Arrow functions stop Node from passing the signal name as `exitCode`.
process.on("SIGTERM", () => {
    console.log("SIGTERM received");
    gracefulShutdown(0);
});

process.on("SIGINT", () => {
    console.log("SIGINT received");
    gracefulShutdown(0);
});

startServer();
