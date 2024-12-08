import { Router } from 'express';
import path from 'path';
import { 
    shortenUrl, 
    redirectToUrl, 
    handleShortCode, 
    getUrlStats 
} from '../controllers/urlController';

const router = Router();

// Static routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/confirm', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/confirm.html'));
});

// API routes
router.post('/api/shorten', shortenUrl);
router.get('/r/:shortCode', redirectToUrl);
router.get('/:shortCode', handleShortCode);
router.get('/api/stats/:shortCode', getUrlStats);

export const urlRoutes = router;