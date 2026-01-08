import { Response } from "express";
import { AuthRequest } from "../../lib/auth-middleware.js";
export declare const shortUrlController: {
    createShortUrl: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    getOriginalUrl: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    redirectToOriginal: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    getUrlsByUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    getUrlCount: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    checkShortCodeAvailability: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteShortUrl: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=shortUrl.controller.d.ts.map