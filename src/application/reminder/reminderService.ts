import { DateTime } from 'luxon';
import { getReminders, updateReminder } from '../../repository/reminder.js';
import { calculateNextOccurrence, RepeatType } from '../../utils/reminder.js';

export const processReminder = async () => {
  const dueReminders = await getReminders();
  for (const reminder of dueReminders) {
    console.log('================================');
    console.log('🔔 REMINDER!');
    console.log(`Task: ${reminder.task_name}`);
    console.log(
      `Description: ${reminder.task_description ?? 'No description'}`,
    );
    console.log(`Task ID: ${reminder.task_id}`);
    console.log(`Reminder time: ${reminder.next_reminder_at}`);
    console.log('================================');
    if (reminder.repeat == 'off') {
      await updateReminder(reminder.task_id, null);
      continue;
    }
    const currentReminder = DateTime.fromJSDate(reminder.next_reminder_at, {
      zone: reminder.timezone,
    });
    const nextOccurance = calculateNextOccurrence(
      currentReminder,
      reminder.repeat as RepeatType,
      reminder.timezone,
    );

    await updateReminder(reminder.task_id, nextOccurance.toUTC().toJSDate());
  }
};
