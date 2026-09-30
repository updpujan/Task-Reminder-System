import { pool } from '../config/databaseConnection.js';

export const getReminders = async () => {
  const result = await pool.query(`SELECT * FROM tasks
        WHERE next_reminder_at >= date_trunc('minute', NOW()) 
        AND next_reminder_at < date_trunc('minute', NOW()) + INTERVAL '1 minute'
        AND is_active = TRUE;`);
  return result.rows;
};

export const updateReminder = async (
  task_id: number,
  nextReminder: Date | null,
) => {
  const result = await pool.query(
    'UPDATE tasks SET next_reminder_at = $1 WHERE task_id =$2;',
    [nextReminder, task_id],
  );
  return result.rowCount;
};
