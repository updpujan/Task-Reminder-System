import { pool } from '../../config/databaseConnection.js';
import { CreateTaskInput } from '../../model/taskModel.js';

export const createTask = async (taskdata: CreateTaskInput) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result1 = await client.query(
      'INSERT INTO tasks (user_id, task_name,task_description) VALUES ($1, $2, $3) RETURNING task_id;',
      [taskdata.user_id, taskdata.task_name, taskdata.task_description],
    );

    const taskId = result1.rows[0].task_id;

    const result2 = await client.query(
      'INSERT INTO reminders (task_id,reminder_date, reminder_time,timezone,repeat) VALUES ($1, $2, $3, $4, $5);',
      [
        taskId,
        taskdata.reminder_date,
        taskdata.reminder_time,
        taskdata.timezone,
        taskdata.repeat,
      ],
    );
    await client.query('COMMIT');

    if (result1.rowCount == 1 && result2.rowCount == 1) {
      return 201;
    }
  } catch {
    await client.query('ROLLBACK');
    return 500;
  } finally {
    client.release();
  }
};
