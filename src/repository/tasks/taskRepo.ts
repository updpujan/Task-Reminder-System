import { pool } from '../../config/databaseConnection.js';
import { CreateTaskInput } from '../../model/taskModel.js';
import { UpdateTaskInput } from '../../schema/task/updateTaskSchemea.js';

export const createTask = async (
  taskdata: CreateTaskInput,
  nextReminderAt: Date,
) => {
  try {
    await pool.query(
      `
      INSERT INTO tasks (
        user_id,
        task_name,
        task_description,
        reminder_date,
        reminder_time,
        timezone,
        repeat,
        next_reminder_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING task_id;
      `,
      [
        taskdata.user_id,
        taskdata.task_name,
        taskdata.task_description ?? null,
        taskdata.reminder_date ?? null,
        taskdata.reminder_time,
        taskdata.timezone,
        taskdata.repeat,
        nextReminderAt ?? null,
      ],
    );

    return 201;
  } catch (error) {
    return {
      status: 500,
      message: 'Task could not be created',
      error,
    };
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

export const deleteTask = async (user_id: number, task_id: number) => {
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE user_id = $1 AND task_id = $2;',
      [user_id, task_id],
    );
    return {
      status: result.rowCount == 0 ? 404 : 204,
      message:
        result.rowCount == 0 ? 'Request resouce not found' : 'Delete sucess',
      data: result.rows,
    };
  } catch (err) {
    return { status: 503, message: 'Database Service Unavliable', error: err };
  }
};

export const updateTask = async (
  uId: number,
  tId: number,
  data: UpdateTaskInput,
) => {
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    for (const [key, value] of Object.entries(data)) {
      const res = await client.query(
        `UPDATE tasks SET ${key} = $1 WHERE user_id = $2 AND task_id = $3;`,
        [value, uId, tId],
      );
      if (res.rowCount == 0) {
        await client.query('ROLLBACK');
        return {
          status: 404,
          message: 'task not found',
        };
      }
    }
    await client.query('COMMIT');
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 AND task_id = $2;',
      [uId, tId],
    );
    return {
      status: 200,
      message: 'task updated sucessfully',
      data: result.rows,
    };
  } catch (err) {
    return {
      status: 503,
      message: 'Database Service Unavaliable',
      error: err,
    };
  } finally {
    if (client) client.release();
  }
};
