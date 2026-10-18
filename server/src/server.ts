import path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '../../.env') });
config({ path: path.resolve(process.cwd(), '.env') });

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
