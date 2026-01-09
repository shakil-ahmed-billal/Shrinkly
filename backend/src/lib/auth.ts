import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import config from "../config/config.js";
import { prisma } from "./prisma.js";

// Determine trusted origins - include both frontend URL and any additional origins
const trustedOrigins = [
  config.APP_URL,
  ...(config.APP_URL && config.APP_URL !== "http://localhost:3000"
    ? ["http://localhost:3000"]
    : []),

  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
].filter(Boolean) as string[];

const authConfig: BetterAuthOptions = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  basePath: "/api/auth",
  baseURL: config.BETTER_AUTH_URL || undefined,
  secret: config.BETTER_AUTH_SECRET || undefined,
  trustedOrigins: trustedOrigins,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    cookiePrefix: config.NODE_ENV === "production" ? "__Secure-" : "",
  } as any,
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "Active",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const auth = betterAuth(authConfig) as any;

export default auth;
export { auth };
