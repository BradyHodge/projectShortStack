import { app } from './app';
import { PORT } from './config/constants';

app.listen(PORT, () => {
    console.log(`Short Stack server running on port ${PORT}`);
});
