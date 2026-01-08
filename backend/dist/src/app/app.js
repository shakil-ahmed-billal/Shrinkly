import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import config from "../config/config";
import auth from "../lib/auth";
import { shortUrlRoutes } from "../modules/shortUrl/shortUrl.routes";
dotenv.config();
const app = express();
// CORS configuration
app.use(cors({
    origin: config.APP_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Short URL routes - register first
app.use("/api", shortUrlRoutes);
// Better Auth routes - must come after short URL routes to avoid conflicts
// Use *splat parameter name for Express 5 compatibility
app.all("/api/auth/*splat", toNodeHandler(auth));
// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Debug route to test API
app.get("/api/test", (req, res) => {
    res.json({
        status: "ok",
        message: "API is working",
        cookies: req.cookies || {},
        cookieHeader: req.headers.cookie || "none",
    });
});
export default app;
//# sourceMappingURL=app.js.map