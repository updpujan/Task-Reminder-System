import { Request, Response } from 'express';
import { CreateTaskInput } from '../model/taskModel.js';
import { createTaskSchema } from '../schema/task/taskSchema.js';
import { updateTaskSchema } from '../schema/task/updateTaskSchemea.js';
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

export const getAllUserTasks = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.sub);
  const response = await taskServices.getUserTasks(user_id);
  if (response.status === 503) {
    return res.status(503).json({
      success: false,
      message: response.message,
      error: response.error,
    });
  }

  return res.status(200).json({
    sucess: true,
    message: response.message,
    data: response.data,
  });
};

export const getUserTaskByID = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.sub);
  const task_id = Number(req.params.id);

  const response = await taskServices.getTaskById(user_id, task_id);
  if (response.status === 503) {
    return res.status(503).json({
      success: false,
      message: response.message,
      error: response.error,
    });
  } else if (response.status === 404) {
    return res.status(404).json({
      success: false,
      message: response.message,
      data: response.data, //empty array
    });
  }

  return res.status(200).json({
    sucess: true,
    message: response.message,
    data: response.data,
  });
};

export const getAllTasks = async (req: Request, res: Response) => {
  const response = await taskServices.getAllTasks();
  if (response.status === 503) {
    return res.status(503).json({
      success: false,
      message: response.message,
      error: response.error,
    });
  } else if (response.status === 404) {
    return res.status(404).json({
      success: false,
      message: response.message,
      data: response.data, //empty array
    });
  }

  return res.status(200).json({
    sucess: true,
    message: response.message,
    data: response.data,
  });
};

export const deleteTask = async (req: Request, res: Response) => {
  const task_id = Number(req.params.id);
  const user_id = Number(req.user?.sub);
  const response = await taskServices.deleteTask(user_id, task_id);
  if (response.status === 503) {
    return res.status(503).json({
      success: false,
      message: response.message,
      error: response.error,
    });
  } else if (response.status === 404) {
    return res.status(404).json({
      success: false,
      message: response.message,
    });
  }

  return res.status(204).send();
};

export const updateTask = async (req: Request, res: Response) => {
  const tId = Number(req.params.id);
  const uId = Number(req.user?.sub);
  const result = updateTaskSchema.safeParse(req.body);
  if (result.success === false) {
    return res.status(400).json({
      sucess: false,
      message: 'Invalid Request body',
      error: result.error.issues.map((err) => err.message),
    });
  }
  const response = await taskServices.updateTask(uId, tId, result.data);
  if (response.status === 200) {
    return res.status(200).json({
      sucess: true,
      message: response.message,
      updated_row: response.data,
    });
  } else {
    if (response.status === 404) {
      return res.status(404).json({
        sucess: false,
        mesage: response.message,
      });
    }
    return res.status(503).json({
      sucess: false,
      message: response.message,
      error: response.error,
    });
  }
};
