import { NextFunction, Request, Response } from "express";

const crossOriginMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Store original methods
  const originalSetHeader = res.setHeader.bind(res);
  const originalSet = res.set.bind(res);
  const originalCookie = (res as any).cookie?.bind(res);


  // Intercept setHeader calls (used by Express and better-auth)
  res.setHeader = function (name: string, value: any) {
    if (name.toLowerCase() === "set-cookie") {
      const cookies = Array.isArray(value) ? value : [value];
      value = cookies.map((cookie: string) => {
        if (
          typeof cookie === "string" &&
          cookie.includes("better-auth.session_token")
        ) {
          // Replace SameSite=Lax with SameSite=None and ensure Secure is set
          cookie = cookie.replace(/SameSite=Lax/gi, "SameSite=None");
          // Ensure Secure is present (required for SameSite=None)
          if (!cookie.includes("Secure")) {
            cookie = cookie.replace(/; Path=/i, "; Secure; Path=");
          }
        }
        return cookie;
      });
      value = Array.isArray(value) && value.length === 1 ? value[0] : value;
    }
    return originalSetHeader(name, value);
  };

  // Intercept set calls (used by Express)
  res.set = function (field: any, value?: any) {
    if (typeof field === "string" && field.toLowerCase() === "set-cookie") {
      const cookies = Array.isArray(value) ? value : [value];
      value = cookies.map((cookie: string) => {
        if (
          typeof cookie === "string" &&
          cookie.includes("better-auth.session_token")
        ) {
          cookie = cookie.replace(/SameSite=Lax/gi, "SameSite=None");
          if (!cookie.includes("Secure")) {
            cookie = cookie.replace(/; Path=/i, "; Secure; Path=");
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
    (res as any).cookie = function (name: string, value: string, options: any) {
      if (name.includes("better-auth.session_token")) {
        options = options || {};
        options.sameSite = "none";
        options.secure = true;
      }
      return originalCookie(name, value, options);
    };
  }

  // Also intercept on finish event to catch any missed headers
  res.on("finish", () => {
    const setCookieHeader = res.getHeader("set-cookie");
    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];
      const modifiedCookies = cookies.map((cookie: any) => {
        if (
          typeof cookie === "string" &&
          cookie.includes("better-auth.session_token")
        ) {
          cookie = cookie.replace(/SameSite=Lax/gi, "SameSite=None");
          if (!cookie.includes("Secure")) {
            cookie = cookie.replace(/; Path=/i, "; Secure; Path=");
          }
        }
        return cookie;
      });
      res.setHeader("set-cookie", modifiedCookies);
    }
  });

  next();
};

export default crossOriginMiddleware;
