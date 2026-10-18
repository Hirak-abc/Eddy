import cron from 'node-cron';
import { SOCIAL_SERVICE } from '../modules/social/social.service';
import { FLYER_SERVICE } from '../modules/flyer/flyer.service';

let started = false;

export const runDuePublishing = async () => {
  try {
    await FLYER_SERVICE.processQueuedFlyers();
  } catch (error) {
    console.error('Flyer generation job failed:', error);
  }

  try {
    await SOCIAL_SERVICE.processDuePosts();
  } catch (error) {
    console.error('Publishing job failed:', error);
  }
};

export const startPublishingJob = () => {
  if (started) return;
  started = true;
  cron.schedule('* * * * *', () => {
    void runDuePublishing();
  });
};
