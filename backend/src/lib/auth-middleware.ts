import { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Helper function to parse cookies
function parseCookies(
  cookieHeader: string | undefined
): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader || typeof cookieHeader !== "string") return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.trim().split("=");
    if (parts.length === 2 && parts[0] && parts[1]) {
      const key = parts[0].trim();
      const value = decodeURIComponent(parts[1].trim());
      if (key && value) {
        cookies[key] = value;
      }
    }
  });

  return cookies;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try to use better-auth's session API
    // Better-auth stores session token in cookies - check all possible names
    let sessionToken: string | undefined;

    // First, check parsed cookies
    if (req.cookies && typeof req.cookies === "object") {
      // Try all possible cookie names
      const cookieNames = [
        "better-auth.session_token",
        "session_token",
        "__session",
        "better-auth.session-token",
        "better-auth.sessionToken",
      ];

      for (const name of cookieNames) {
        if (req.cookies?.[name]) {
          sessionToken = req.cookies[name];
          break;
        }
      }

      // If not found, check any cookie that looks like a session token
      if (!sessionToken && req.cookies) {
        for (const [key, value] of Object.entries(req.cookies)) {
          if (key.includes("session") || key.includes("auth")) {
            if (typeof value === "string" && value.length > 20) {
              sessionToken = value;
              break;
            }
          }
        }
      }
    }

    // Parse from raw cookie header if not found
    if (!sessionToken && req.headers.cookie) {
      const cookies = parseCookies(req.headers.cookie);

      // Try all possible cookie names
      sessionToken =
        cookies["better-auth.session_token"] ||
        cookies["session_token"] ||
        cookies["__session"] ||
        cookies["better-auth.session-token"] ||
        cookies["better-auth.sessionToken"];

      // If still not found, check any cookie that looks like a session token
      if (!sessionToken) {
        for (const [key, value] of Object.entries(cookies)) {
          if (key.includes("session") || key.includes("auth")) {
            if (value.length > 20) {
              sessionToken = value;
              break;
            }
          }
        }
      }
    }

    // Fallback to authorization header
    if (!sessionToken && req.headers.authorization) {
      sessionToken = req.headers.authorization.replace("Bearer ", "").trim();
    }

    if (!sessionToken) {
      console.log(
        "No session token found. Cookies:",
        req.cookies || {},
        "Header:",
        req.headers.cookie || "none"
      );
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No session token found",
      });
    }

    // Find session in database
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      console.log(
        "Session not found for token:",
        sessionToken?.substring(0, 20) + "..."
      );
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid session",
      });
    }

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Session expired",
      });
    }

    // Attach user to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };

    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Authentication failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
