import app from './app.js';
import databaseConnection from './config/databaseConnection.js';
import { startReminderSchedular } from './jobs/reminderSchedular.js';
import 'dotenv/config';

const PORT = process.env.PORT;

try {
  const status = await databaseConnection();
  if (status == 200) console.log('Database COnnected');
  app.listen(PORT, () => {
    console.log(`Server Running on Port: ${PORT}`);
    startReminderSchedular();
  });
} catch (e) {
  console.log(`Error in Server Starting:\n${e}`);
  process.exit(1);
}
