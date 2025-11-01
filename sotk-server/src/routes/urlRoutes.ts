import { Router } from 'express';
import path from 'path';
import {
    redirectToUrl,
    handleShortCode
} from '../controllers/urlController';

const router = Router();

// Landing page that redirects to shortstack.cc
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/landing.html'));
});

// Manage trusted domains page
router.get('/manage-trusted', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/manage-trusted.html'));
});

// Confirmation page for non-whitelisted domains
router.get('/confirm', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/confirm.html'));
});

// Direct redirect route (bypasses whitelist check)
router.get('/r/:shortCode', redirectToUrl);

// Smart redirect route (checks whitelist)
router.get('/:shortCode', handleShortCode);

export const urlRoutes = router;
