import { shortUrlService } from "./shortUrl.service.js";
const createShortUrl = async (req, res) => {
    try {
        const { originalUrl, shortCode } = req.body;
        if (!originalUrl) {
            return res.status(400).json({
                success: false,
                message: "Original URL is required",
            });
        }
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result = await shortUrlService.createShortUrl(originalUrl, shortCode, req.user.id);
        return res.status(201).json({
            success: true,
            message: "Short URL created successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to create short URL",
        });
    }
};
const getOriginalUrl = async (req, res) => {
    try {
        const { code } = req.params;
        const url = await shortUrlService.getOriginalUrl(code);
        return res.status(200).json({ success: true, data: url });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message || "Short URL not found",
        });
    }
};
const redirectToOriginal = async (req, res) => {
    try {
        const { code } = req.params;
        const url = await shortUrlService.getOriginalUrl(code);
        shortUrlService.incrementClicks(code).catch(console.error);
        return res.status(200).json({
            success: true,
            data: {
                originalUrl: url.originalUrl,
            },
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message || "Short URL not found",
        });
    }
};
const getUrlsByUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const urls = await shortUrlService.getUrlsByUser(req.user.id);
        // Transform data to match frontend format
        const transformedUrls = urls.map((url) => ({
            id: url.id,
            original_url: url.originalUrl,
            short_code: url.shortCode,
            clicks: url.clicks,
            created_at: url.createdAt.toISOString(),
        }));
        return res.status(200).json({
            success: true,
            data: transformedUrls,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch URLs",
        });
    }
};
const getUrlCount = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const count = await shortUrlService.getUrlCount(req.user.id);
        return res.status(200).json({
            success: true,
            data: {
                url_count: count,
                max_urls: 100,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get URL count",
        });
    }
};
const checkShortCodeAvailability = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Code parameter is required",
            });
        }
        const exists = await shortUrlService.checkShortCodeAvailability(code);
        return res.status(200).json({ success: true, data: { exists } });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to check code availability",
        });
    }
};
const deleteShortUrl = async (req, res) => {
    try {
        const { code } = req.params;
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await shortUrlService.deleteShortUrl(code, req.user.id);
        return res.status(200).json({
            success: true,
            message: "Short URL deleted successfully",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to delete short URL",
        });
    }
};
export const shortUrlController = {
    createShortUrl,
    getOriginalUrl,
    redirectToOriginal,
    getUrlsByUser,
    getUrlCount,
    checkShortCodeAvailability,
    deleteShortUrl,
};
//# sourceMappingURL=shortUrl.controller.js.map