export declare const shortUrlService: {
    createShortUrl: (originalUrl: string, shortCode: string, id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalUrl: string;
        shortCode: string;
        clicks: number;
    }>;
    getOriginalUrl: (shortCode: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalUrl: string;
        shortCode: string;
        clicks: number;
    }>;
    getUrlsByUser: (userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalUrl: string;
        shortCode: string;
        clicks: number;
    }[]>;
    deleteShortUrl: (shortCode: string, userId: string) => Promise<boolean>;
    getUrlCount: (userId: string) => Promise<number>;
    incrementClicks: (shortCode: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        originalUrl: string;
        shortCode: string;
        clicks: number;
    }>;
    checkShortCodeAvailability: (shortCode: string) => Promise<boolean>;
};
//# sourceMappingURL=shortUrl.service.d.ts.map