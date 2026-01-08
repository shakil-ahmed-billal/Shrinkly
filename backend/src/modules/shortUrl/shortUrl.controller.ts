import { Response } from "express";
import { shortUrlService } from "./shortUrl.service";
import { AuthRequest } from "../../lib/auth-middleware";

const createShortUrl = async (req: AuthRequest, res: Response) => {
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

    const result = await shortUrlService.createShortUrl(
      originalUrl,
      shortCode,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create short URL",
    });
  }
};

const getOriginalUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.params as { code: string };
    const url = await shortUrlService.getOriginalUrl(code);
    return res.status(200).json({ success: true, data: url });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Short URL not found",
    });
  }
};

const redirectToOriginal = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.params as { code: string };
    const url = await shortUrlService.getOriginalUrl(code);

    shortUrlService.incrementClicks(code).catch(console.error);

    return res.status(200).json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
      },
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Short URL not found",
    });
  }
};

const getUrlsByUser = async (req: AuthRequest, res: Response) => {
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch URLs",
    });
  }
};

const getUrlCount = async (req: AuthRequest, res: Response) => {
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get URL count",
    });
  }
};

const checkShortCodeAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code parameter is required",
      });
    }
    const exists = await shortUrlService.checkShortCodeAvailability(
      code as string
    );
    return res.status(200).json({ success: true, data: { exists } });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to check code availability",
    });
  }
};

const deleteShortUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.params as { code: string };

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
  } catch (error: any) {
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
