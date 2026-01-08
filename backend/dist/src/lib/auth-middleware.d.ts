import { NextFunction, Request, Response } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
    params: Request["params"];
    query: Request["query"];
    body: Request["body"];
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth-middleware.d.ts.map