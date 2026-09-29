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

export const getUserTasks = async (id: number) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1;', [
      id,
    ]);
    return {
      status: 200,
      message: result.rowCount == 0 ? 'Sucess but no data' : 'Sucess with data',
      data: result.rows,
    };
  } catch (err) {
    return { status: 503, message: 'Database Service Unavliable', error: err };
  }
};

export const getUserTaskById = async (userId: number, taskId: number) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id =$1 AND task_id =$2;',
      [userId, taskId],
    );
    return {
      status: result.rowCount == 0 ? 404 : 200,
      message:
        result.rowCount == 0 ? 'Request resouce not found' : 'Sucess with data',
      data: result.rows,
    };
  } catch (err) {
    return { status: 503, message: 'Database Service Unavliable', error: err };
  }
};

export const getAllTasks = async () => {
  try {
    const result = await pool.query('SELECT * FROM tasks;');
    return {
      status: result.rowCount == 0 ? 404 : 200,
      message:
        result.rowCount == 0 ? 'Request resouce not found' : 'Sucess with data',
      data: result.rows,
    };
  } catch (err) {
    return { status: 503, message: 'Database Service Unavliable', error: err };
  }
};
