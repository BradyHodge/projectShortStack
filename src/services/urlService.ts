import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { DEFAULT_WHITELIST_DOMAINS } from '../config/constants';
import { urlDatabase } from '../models/url';
import { generateShortCode } from '../utils/shortCode';
import { URLModel } from '../models/url';
import { PORT } from '../config/constants';

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

export function findExistingUrl(originalUrl: string): URLModel | undefined {
    return Array.from(urlDatabase.values()).find(
        url => url.originalUrl === originalUrl
    );
}

export function createShortUrl(originalUrl: string): URLModel {
    const shortCode = generateShortCode();
    const urlModel: URLModel = {
        originalUrl,
        shortCode,
        createdAt: new Date(),
        clicks: 0
    };

    urlDatabase.set(shortCode, urlModel);
    return urlModel;
}

export function getShortUrl(shortCode: string): string {
    return `http://localhost:${PORT}/${shortCode}`;
}

export function incrementClicks(urlData: URLModel): void {
    urlData.clicks += 1;
    urlDatabase.set(urlData.shortCode, urlData);
}