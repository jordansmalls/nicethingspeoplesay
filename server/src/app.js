import express from "express";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import cors from "cors";


export const app = express();

app.use(express.json());
app.use(logger);
app.use(cors(env.corsOptions));


app.get("/", (req, res) => res.send("API is live."));

app.get("/server/health", (req, res) => {
    res.json({
        status: 200,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
    });
});
