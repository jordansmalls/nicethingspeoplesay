import express from "express";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import cors from "cors";
import auth from "./routes/auth.routes.js"
import things from "./routes/things.routes.js";
import compression from "compression";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors(env.corsOptions));
app.use(express.json());
app.use(logger);
app.use(compression())
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth", auth)
app.use("/api/things", things)


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
