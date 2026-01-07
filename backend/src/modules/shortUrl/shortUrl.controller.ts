import { Request, Response } from "express";
import { shortUrlService } from "./shortUrl.service";

const createShortUrl = async (req: Request, res: Response) => {
  const { originalUrl, id, shortCode } = req.body;

  if (!originalUrl) {
    return res.status(400).json({
      success: false,
      message: "Original URL is required",
    });
  } else {
    const create: any = await shortUrlService.createShortUrl(
      originalUrl,
      shortCode,
      id
    );

    if (create) {
      return res.status(201).json({
        success: true,
        message: "Short URL created successfully",
        data: create,
      });
    }
  }
};

export const shortUrlController = {
  createShortUrl,
};
