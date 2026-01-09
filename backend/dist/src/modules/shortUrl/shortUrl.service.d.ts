export declare const shortUrlService: {
    createShortUrl: (originalUrl: string, shortCode: string, id: string) => Promise<{
        id: string;
        originalUrl: string;
        shortCode: string;
        clicks: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getOriginalUrl: (shortCode: string) => Promise<{
        id: string;
        originalUrl: string;
        shortCode: string;
        clicks: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    getUrlsByUser: (userId: string) => Promise<{
        id: string;
        originalUrl: string;
        shortCode: string;
        clicks: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    deleteShortUrl: (shortCode: string, userId: string) => Promise<boolean>;
    getUrlCount: (userId: string) => Promise<number>;
    incrementClicks: (shortCode: string) => Promise<{
        id: string;
        originalUrl: string;
        shortCode: string;
        clicks: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    checkShortCodeAvailability: (shortCode: string) => Promise<boolean>;
};
//# sourceMappingURL=shortUrl.service.d.ts.map