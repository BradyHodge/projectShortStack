import { Request, Response } from 'express';
import { ShortenRequestBody, ShortCodeParams } from '../interfaces/types';
import { urlDatabase } from '../models/url';
import {
    isWhitelisted,
    findExistingUrl,
    createShortUrl,
    getShortUrl,
    incrementClicks
} from '../services/urlService';

export async function shortenUrl(req: Request<{}, {}, ShortenRequestBody>, res: Response) {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ error: 'Original URL is required' });
        }

        try {
            new URL(originalUrl);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        const existingUrl = await findExistingUrl(originalUrl);
        if (existingUrl) {
            return res.json({
                shortCode: existingUrl.shortCode,
                shortUrl: getShortUrl(existingUrl.shortCode),
                whitelisted: isWhitelisted(originalUrl)
            });
        }

        const urlModel = await createShortUrl(originalUrl);
        res.json({
            shortCode: urlModel.shortCode,
            shortUrl: getShortUrl(urlModel.shortCode),
            whitelisted: isWhitelisted(originalUrl)
        });
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function redirectToUrl(req: Request<ShortCodeParams>, res: Response) {
    try {
        const { shortCode } = req.params;
        const urlData = await urlDatabase.get(shortCode);

        if (!urlData) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        await incrementClicks(urlData);
        res.redirect(urlData.originalUrl);
    } catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function handleShortCode(req: Request<ShortCodeParams>, res: Response) {
    try {
        const { shortCode } = req.params;
        const urlData = await urlDatabase.get(shortCode);

        if (!urlData) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        if (isWhitelisted(urlData.originalUrl)) {
            await incrementClicks(urlData);
            return res.redirect(urlData.originalUrl);
        }

        const destinationUrl = encodeURIComponent(urlData.originalUrl);
        res.redirect(`/confirm?destination=${destinationUrl}&shortCode=${shortCode}`);
    } catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getUrlStats(req: Request<ShortCodeParams>, res: Response) {
    try {
        const { shortCode } = req.params;
        const urlData = await urlDatabase.get(shortCode);

        if (!urlData) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.json({
            originalUrl: urlData.originalUrl,
            shortCode: urlData.shortCode,
            clicks: urlData.clicks,
            createdAt: urlData.createdAt,
            whitelisted: isWhitelisted(urlData.originalUrl)
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}