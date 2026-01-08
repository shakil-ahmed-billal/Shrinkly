import auth from "./auth";
export const authMiddleware = async (req, res, next) => {
    try {
        const sessionResult = await auth.api.getSession({
            headers: req.headers,
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
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Authentication failed",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
//# sourceMappingURL=auth-middleware.js.map