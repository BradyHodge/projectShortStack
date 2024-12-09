import e from "express";

export const PORT = process.env.PORT || 3000;

export const DEFAULT_WHITELIST_DOMAINS = [
    'github.com',
    'youtube.com',
    'google.com'
];
export const CODE_LENGTH = 4;

export const MAX_ATTEMPTS = 100;