import { NextFunction, Request, Response } from "express";
import auth from "./auth";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const sessionResult = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!sessionResult || !sessionResult.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired session",
      });
    }

    req.user = {
      id: sessionResult.user.id,
      email: sessionResult.user.email,
      name: sessionResult.user.name || "",
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
