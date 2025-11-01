import { app } from './app';
import { PORT } from './config/constants';
import { loadTrustedDomains } from './services/urlService';
import path from 'path';

async function initializeApp() {
    try {
        await loadTrustedDomains(path.join(__dirname, 'whitelistDomains.csv'));
        
        app.listen(PORT, () => {
            console.log(`SOTK redirect server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
        process.exit(1);
    }
}

initializeApp();
