import { prisma } from "../../lib/prisma";

const createShortUrl = async (
  originalUrl: string,
  shortCode: string,
  id: string
) => {
  try {
    // Check user's URL count first
    const urlCount = await prisma.shortUrl.count({
      where: { userId: id },
    });

    if (urlCount >= 100) {
      throw new Error("Maximum URL limit reached (100 URLs)");
    }

    // Try to create the short URL
    // Prisma will throw an error if shortCode is not unique
    const create = await prisma.shortUrl.create({
      data: {
        originalUrl: originalUrl,
        shortCode: shortCode,
        userId: id,
      },
    });

    return create;
  } catch (error: any) {
    // Check if it's a Prisma unique constraint error
    if (error.code === 'P2002' && error.meta?.target?.includes('shortCode')) {
      throw new Error("Short code already exists. Please try again.");
    }
    throw error;
  }
};

const getOriginalUrl = async (shortCode: string) => {
  try {
    const url = await prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new Error("Short URL not found");
    }

    return url;
  } catch (error: any) {
    throw error;
  }
};

const getUrlsByUser = async (userId: string) => {
  try {
    const urls = await prisma.shortUrl.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return urls;
  } catch (error: any) {
    throw error;
  }
};

const deleteShortUrl = async (shortCode: string, userId: string) => {
  try {
    // Verify ownership
    const url = await prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new Error("Short URL not found");
    }

    if (url.userId !== userId) {
      throw new Error("Unauthorized: You don't own this URL");
    }

    await prisma.shortUrl.delete({
      where: { shortCode },
    });

    return true;
  } catch (error: any) {
    throw error;
  }
};

const getUrlCount = async (userId: string) => {
  try {
    const count = await prisma.shortUrl.count({
      where: { userId },
    });

    return count;
  } catch (error: any) {
    throw error;
  }
};

const incrementClicks = async (shortCode: string) => {
  try {
    const url = await prisma.shortUrl.update({
      where: { shortCode },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    return url;
  } catch (error: any) {
    throw error;
  }
};

const checkShortCodeAvailability = async (shortCode: string) => {
  try {
    const existing = await prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    return !!existing;
  } catch (error: any) {
    throw error;
  }
};

export const shortUrlService = {
  createShortUrl,
  getOriginalUrl,
  getUrlsByUser,
  deleteShortUrl,
  getUrlCount,
  incrementClicks,
  checkShortCodeAvailability,
};
