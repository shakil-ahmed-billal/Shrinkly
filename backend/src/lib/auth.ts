import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import config from "../config/config";

const authConfig: BetterAuthOptions = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  basePath: "/api/auth",
  trustedOrigins:[config.APP_URL],
  user:{
    additionalFields:{
        role:{
            type: "string",
            defaultValue: "USER",
            required: false
        },
        phone:{
            type: "string",
            required: false
        },
        status:{
            type: "string",
            defaultValue: "Active",
            required:false
        }
    }
  },
  emailAndPassword: { 
    enabled: true, 
  }, 
};

const auth = betterAuth(authConfig);

export default auth;
export { auth };
