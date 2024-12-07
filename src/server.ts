import express, { Request, Response } from 'express';
import { URLModel } from './models/url';
import { generateShortCode } from './utils/shortCode';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const urlDatabase = new Map<string, URLModel>();

interface ShortenRequestBody {
    originalUrl: string;
}

app.post('/api/shorten', (req: Request<{}, {}, ShortenRequestBody>, res: Response) => {
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

        const existingUrl = Array.from(urlDatabase.values()).find(
            url => url.originalUrl === originalUrl
        );

        if (existingUrl) {
            return res.json({
                shortCode: existingUrl.shortCode,
                shortUrl: `http://localhost:${PORT}/${existingUrl.shortCode}`
            });
        }

        const shortCode = generateShortCode();

        const urlModel: URLModel = {
            originalUrl,
            shortCode,
            createdAt: new Date(),
            clicks: 0
        };

        urlDatabase.set(shortCode, urlModel);

        res.json({
            shortCode,
            shortUrl: `http://localhost:${PORT}/${shortCode}`
        });
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

interface ShortCodeParams {
    shortCode: string;
}

app.get('/:shortCode', (req: Request<ShortCodeParams>, res: Response) => {
    try {
        const { shortCode } = req.params;
        const urlData = urlDatabase.get(shortCode);

        if (!urlData) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        urlData.clicks += 1;
        urlDatabase.set(shortCode, urlData);

        res.redirect(urlData.originalUrl);
    } catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/stats/:shortCode', (req: Request<ShortCodeParams>, res: Response) => {
    try {
        const { shortCode } = req.params;
        const urlData = urlDatabase.get(shortCode);

        if (!urlData) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.json({
            originalUrl: urlData.originalUrl,
            shortCode: urlData.shortCode,
            clicks: urlData.clicks,
            createdAt: urlData.createdAt
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});






