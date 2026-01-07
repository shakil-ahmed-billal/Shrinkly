import { Router } from "express";
import { shortUrlController } from "./shortUrl.controller";

const router = Router();

router.post("/v1/shorten", shortUrlController.createShortUrl);

export const shortUrlRoutes: Router = router;
