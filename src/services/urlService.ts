import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { DEFAULT_WHITELIST_DOMAINS } from '../config/constants';
import { urlDatabase } from '../models/url';
import { generateShortCode } from '../utils/shortCode';
import { URLModel } from '../models/url';
import { MAX_ATTEMPTS } from '../config/constants';

let WHITELIST_DOMAINS: string[] = [];

export async function loadTrustedDomains(filePath: string): Promise<string[]> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        WHITELIST_DOMAINS = records
            .map((record: any) => record.domain)
            .filter((domain: string) => domain && domain.length > 0);
        return WHITELIST_DOMAINS;
    } catch (error) {
        console.error('Error loading trusted domains (loading default): ', error);
        WHITELIST_DOMAINS = DEFAULT_WHITELIST_DOMAINS;
        return WHITELIST_DOMAINS;
    }
}

export function isWhitelisted(urlString: string): boolean {
    try {
        const url = new URL(urlString);
        return WHITELIST_DOMAINS.some(domain =>
            url.hostname === domain || url.hostname.endsWith(`.${domain}`));
    } catch {
        return false;
    }
}

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

export async function incrementClicks(urlData: URLModel): Promise<void> {
    urlData.clicks += 1;
    await urlDatabase.set(urlData.shortCode, urlData);
}