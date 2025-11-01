import { Request, Response } from 'express';
import { ShortCodeParams } from '../interfaces/types';
import { urlDatabase } from '../models/url';
import {
    isWhitelisted,
    incrementClicks
} from '../services/urlService';

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
