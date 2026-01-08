import { Router } from "express";
import { authMiddleware } from "../../lib/auth-middleware";
import { shortUrlController } from "./shortUrl.controller";

const router = Router();

router.get("/redirect/:code", shortUrlController.redirectToOriginal);

router.post("/v1/shorten",authMiddleware, shortUrlController.createShortUrl);
router.get("/short-urls", authMiddleware, shortUrlController.getUrlsByUser);
router.get("/short-urls/count", authMiddleware, shortUrlController.getUrlCount);
router.delete("/short-urls/:code", authMiddleware, shortUrlController.deleteShortUrl);
router.get("/short-urls/check", authMiddleware, shortUrlController.checkShortCodeAvailability);

export const shortUrlRoutes: Router = router;
