import { Router } from 'express';
import path from 'path';
import {
    shortenUrl,
    getUrlStats
} from '../controllers/urlController';

const router = Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.post('/api/shorten', shortenUrl);
router.get('/api/stats/:shortCode', getUrlStats);

export const urlRoutes = router;
