import { config } from 'dotenv';
config(); // Load .env file

import app from './app';
import { config as envConfig } from './config/env';
import { startPublishingJob } from './jobs/publishing.job';

const PORT = envConfig.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (envConfig.NODE_ENV !== 'test') {
    startPublishingJob();
  }
});
