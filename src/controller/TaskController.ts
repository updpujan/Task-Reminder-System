import { Request, Response } from 'express';
import { CreateTaskInput } from '../model/taskModel.js';
import { createTaskSchema } from '../schema/task/taskSchema.js';
import * as taskServices from '../application/task/taskServices.js';

export const createTask = async (req: Request, res: Response) => {
  const result = createTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      sucess: false,
      message: 'Validation failed',
      errors: result.error.issues.map((issue) => issue.message),
    });
  }
  const taskInput: CreateTaskInput = {
    user_id: Number(req.user?.sub),
    role: String(req.user?.role),

    task_name: req.body.task_name,
    task_description: req.body.task_description,

    status: 'enabled',
    is_deleted: false,

    reminder_date: req.body.reminder_date,
    reminder_time: req.body.reminder_time,
    timezone: req.body.timezone,
    repeat: req.body.repeat,

    is_active: true,
  };
  const response = await taskServices.createTask(taskInput);
  if (response == 201) {
    return res
      .status(201)
      .json({ status: 201, message: 'Task Created Sucessfully' });
  } else {
    return res
      .status(500)
      .json({ status: 500, message: 'Failed to create Task' });
  }
};
