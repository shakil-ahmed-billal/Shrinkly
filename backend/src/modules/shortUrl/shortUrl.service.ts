import { prisma } from "../../lib/prisma";

const createShortUrl = async (
  originalUrl: string,
  shortCode: string,
  id: string
) => {
  try {
    const create = await prisma.shortUrl.create({
      data: {
        originalUrl: originalUrl,
        shortCode: shortCode,
        userId: id,
      },
    });

    return create;
  } catch (error) {
    return error;
  }
};

export const shortUrlService = {
  createShortUrl,
};
