export interface URLModel {
    originalUrl: string;
    shortCode: string;
    createdAt: Date;
    clicks: number;
}

export const urlDatabase = new Map<string, URLModel>();