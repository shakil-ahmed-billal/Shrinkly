import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import config from "../config/config";
import auth from "../lib/auth";
import { shortUrlRoutes } from "../modules/shortUrl/shortUrl.routes";

dotenv.config();

const app: Application = express();

// CORS configuration
app.use(
  cors({
    origin: config.APP_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better Auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", shortUrlRoutes);

export default app;
