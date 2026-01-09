import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import config from "./config/config.js";
import { shortUrlRoutes } from "./modules/shortUrl/shortUrl.routes.js";
import auth from "./lib/auth.js";
import crossOriginMiddleware from "./middleware/cross-origin.js";
dotenv.config();
const app = express();
// CORS configuration
const allowedOrigins = [
    config.APP_URL || "http://localhost:3000",
    "http://localhost:3000",
    "https://shrinkly-gules.vercel.app",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to fix SameSite cookie attribute for cross-origin requests
app.use(crossOriginMiddleware);
// Short URL routes - register first
app.use("/api", shortUrlRoutes);
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