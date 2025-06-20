module.exports = {
    apps: [
        {
            name: "lalonstore-server",
            script: "dist/server.js",
            watch: false, // disable watching in production
            instances: 1, // You can set 'max' for all available CPU cores
            exec_mode: "fork", // enables load balancing
            autorestart: false, // restart on crash
            max_memory_restart: "2048M", // Auto-restart if memory usage exceeds 500MB
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
            error_file: "./logs/pm2-error.log", // Log file for errors
            out_file: "./logs/pm2-out.log", // Log file for standard output
            log_date_format: "DD-MM-YYYY HH:mm:ss", // Date format for logs
        },
    ],
};
