import { urlDatabase } from '../models/url';
import { generateShortCode } from '../utils/shortCode';
import { URLModel } from '../models/url';
import { MAX_ATTEMPTS } from '../config/constants';

export async function findExistingUrl(originalUrl: string): Promise<URLModel | undefined> {
    const allUrls = await urlDatabase.values();
    return allUrls.find(url => url.originalUrl === originalUrl);
}

class ShortCodeGenerationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ShortCodeGenerationError';
    }
}

async function generateUniqueShortCode(): Promise<string> {
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
        const shortCode = generateShortCode();
        const exists = await urlDatabase.has(shortCode);
        if (!exists) {
            return shortCode;
        }
        attempts++;
    }

    throw new ShortCodeGenerationError(`Failed to generate unique short code after ${MAX_ATTEMPTS} attempts`);
}

export async function createShortUrl(originalUrl: string): Promise<URLModel> {
    try {
        const shortCode = await generateUniqueShortCode();
        const urlModel: URLModel = {
            originalUrl,
            shortCode,
            createdAt: new Date(),
            clicks: 0
        };
        await urlDatabase.set(shortCode, urlModel);
        return urlModel;
    } catch (error) {
        if (error instanceof ShortCodeGenerationError) {
            throw new Error('Server error: Unable to generate unique short code. Please try again later.');
        }
        throw error;
    }
}

export function getShortUrl(shortCode: string): string {
    return `https://sotk.cc/${shortCode}`;
}
