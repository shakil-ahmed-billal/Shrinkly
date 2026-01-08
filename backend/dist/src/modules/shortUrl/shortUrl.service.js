import { prisma } from "../../lib/prisma.js";
const createShortUrl = async (originalUrl, shortCode, id) => {
    try {
        const urlCount = await prisma.shortUrl.count({
            where: { userId: id },
        });
        if (urlCount >= 100) {
            throw new Error("Maximum URL limit reached (100 URLs)");
        }
        const create = await prisma.shortUrl.create({
            data: {
                originalUrl: originalUrl,
                shortCode: shortCode,
                userId: id,
            },
        });
        return create;
    }
    catch (error) {
        // Check if it's a Prisma unique constraint error
        if (error.code === 'P2002' && error.meta?.target?.includes('shortCode')) {
            throw new Error("Short code already exists. Please try again.");
        }
        throw error;
    }
};
const getOriginalUrl = async (shortCode) => {
    try {
        const url = await prisma.shortUrl.findUnique({
            where: { shortCode },
        });
        if (!url) {
            throw new Error("Short URL not found");
        }
        return url;
    }
    catch (error) {
        throw error;
    }
};
const getUrlsByUser = async (userId) => {
    try {
        const urls = await prisma.shortUrl.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return urls;
    }
    catch (error) {
        throw error;
    }
};
const deleteShortUrl = async (shortCode, userId) => {
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
    }
    catch (error) {
        throw error;
    }
};
const getUrlCount = async (userId) => {
    try {
        const count = await prisma.shortUrl.count({
            where: { userId },
        });
        return count;
    }
    catch (error) {
        throw error;
    }
};
const incrementClicks = async (shortCode) => {
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
    }
    catch (error) {
        throw error;
    }
};
const checkShortCodeAvailability = async (shortCode) => {
    try {
        const existing = await prisma.shortUrl.findUnique({
            where: { shortCode },
        });
        return !!existing;
    }
    catch (error) {
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
//# sourceMappingURL=shortUrl.service.js.map