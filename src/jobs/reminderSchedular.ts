import cron from 'node-cron';
import { processReminder } from '../application/reminder/reminderService.js';

export const startReminderSchedular = () => {
  cron.schedule('10 * * * * *', async () => {
    try {
      await processReminder();
    } catch (err) {
      console.log(err);
    }
  });
  console.log('Reminder scheduler started');
};
