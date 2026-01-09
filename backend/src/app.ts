import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import config from "./config/config.js";
import { shortUrlRoutes } from "./modules/shortUrl/shortUrl.routes.js";
import auth from "./lib/auth.js";


dotenv.config();

const app: Application = express();

// CORS configuration
const allowedOrigins = [
  config.APP_URL || "http://localhost:3000",
  "http://localhost:3000",
  "https://shrinkly-gules.vercel.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to fix SameSite cookie attribute for cross-origin requests
app.use((req, res, next) => {
  // Store original methods
  const originalSetHeader = res.setHeader.bind(res);
  const originalSet = res.set.bind(res);
  const originalCookie = (res as any).cookie?.bind(res);
  
  // Intercept setHeader calls (used by Express and better-auth)
  res.setHeader = function(name: string, value: any) {
    if (name.toLowerCase() === 'set-cookie') {
      const cookies = Array.isArray(value) ? value : [value];
      value = cookies.map((cookie: string) => {
        if (typeof cookie === 'string' && cookie.includes('better-auth.session_token')) {
          // Replace SameSite=Lax with SameSite=None and ensure Secure is set
          cookie = cookie.replace(/SameSite=Lax/gi, 'SameSite=None');
          // Ensure Secure is present (required for SameSite=None)
          if (!cookie.includes('Secure')) {
            cookie = cookie.replace(/; Path=/i, '; Secure; Path=');
          }
        }
        return cookie;
      });
      value = Array.isArray(value) && value.length === 1 ? value[0] : value;
    }
    return originalSetHeader(name, value);
  };
  
  // Intercept set calls (used by Express)
  res.set = function(field: any, value?: any) {
    if (typeof field === 'string' && field.toLowerCase() === 'set-cookie') {
      const cookies = Array.isArray(value) ? value : [value];
      value = cookies.map((cookie: string) => {
        if (typeof cookie === 'string' && cookie.includes('better-auth.session_token')) {
          cookie = cookie.replace(/SameSite=Lax/gi, 'SameSite=None');
          if (!cookie.includes('Secure')) {
            cookie = cookie.replace(/; Path=/i, '; Secure; Path=');
          }
        }
        return cookie;
      });
      value = Array.isArray(value) && value.length === 1 ? value[0] : value;
    }
    return originalSet(field, value);
  };
  
  // Intercept cookie() calls if they exist
  if ((res as any).cookie) {
    (res as any).cookie = function(name: string, value: string, options: any) {
      if (name.includes('better-auth.session_token')) {
        options = options || {};
        options.sameSite = 'none';
        options.secure = true;
      }
      return originalCookie(name, value, options);
    };
  }
  
  // Also intercept on finish event to catch any missed headers
  res.on('finish', () => {
    const setCookieHeader = res.getHeader('set-cookie');
    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      const modifiedCookies = cookies.map((cookie: any) => {
        if (typeof cookie === 'string' && cookie.includes('better-auth.session_token')) {
          cookie = cookie.replace(/SameSite=Lax/gi, 'SameSite=None');
          if (!cookie.includes('Secure')) {
            cookie = cookie.replace(/; Path=/i, '; Secure; Path=');
          }
        }
        return cookie;
      });
      res.setHeader('set-cookie', modifiedCookies);
    }
  });
  
  next();
});

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
