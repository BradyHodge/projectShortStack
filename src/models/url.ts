import Database from 'better-sqlite3';
import path from 'path';

export interface URLModel {
    originalUrl: string;
    shortCode: string;
    createdAt: Date;
    clicks: number;
}

interface URLRow {
    shortCode: string;
    originalUrl: string;
    createdAt: string;
    clicks: number;
}

export class URLDatabase {
    private db: Database.Database;

    constructor() {
        const dbPath = path.join(process.env.DB_PATH || './data', 'urls.db');
        this.db = new Database(dbPath);
        this.initialize();
    }

    private initialize() {
        const createTable = `
            CREATE TABLE IF NOT EXISTS urls (
                shortCode TEXT PRIMARY KEY,
                originalUrl TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                clicks INTEGER DEFAULT 0
            )
        `;
        this.db.exec(createTable);
    }

    async get(shortCode: string): Promise<URLModel | undefined> {
        const stmt = this.db.prepare('SELECT * FROM urls WHERE shortCode = ?');
        const result = stmt.get(shortCode) as URLRow | undefined;

        if (!result) {
            return undefined;
        }

        return {
            shortCode: result.shortCode,
            originalUrl: result.originalUrl,
            createdAt: new Date(result.createdAt),
            clicks: result.clicks
        };
    }

    async has(shortCode: string): Promise<boolean> {
        const stmt = this.db.prepare('SELECT 1 FROM urls WHERE shortCode = ?');
        const result = stmt.get(shortCode);
        return result !== undefined;
    }

    async set(shortCode: string, urlModel: URLModel): Promise<void> {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO urls (shortCode, originalUrl, createdAt, clicks)
            VALUES (@shortCode, @originalUrl, @createdAt, @clicks)
        `);

        stmt.run({
            shortCode: urlModel.shortCode,
            originalUrl: urlModel.originalUrl,
            createdAt: urlModel.createdAt.toISOString(),
            clicks: urlModel.clicks
        });
    }

    async values(): Promise<URLModel[]> {
        const stmt = this.db.prepare('SELECT * FROM urls');
        const results = stmt.all() as URLRow[];

        return results.map(result => ({
            shortCode: result.shortCode,
            originalUrl: result.originalUrl,
            createdAt: new Date(result.createdAt),
            clicks: result.clicks
        }));
    }
}

export const urlDatabase = new URLDatabase();