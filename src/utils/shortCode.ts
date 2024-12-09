import { CODE_LENGTH } from '../config/constants';
const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';


export function generateShortCode(): string {
    let shortCode = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
        shortCode += CHARACTERS[randomIndex];
    }
    return shortCode;
}