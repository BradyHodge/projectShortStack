export interface ShortenRequestBody {
    originalUrl: string;
}

export interface ShortCodeParams {
    shortCode: string;
}

export interface URLResponse {
    shortCode: string;
    shortUrl: string;
    whitelisted: boolean;
}

export interface URLStats extends URLResponse {
    originalUrl: string;
    clicks: number;
    createdAt: Date;
}