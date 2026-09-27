import { config } from 'dotenv';
config(); // Load .env file

import app from './app';
import { config as envConfig } from './config/env';

const PORT = envConfig.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
