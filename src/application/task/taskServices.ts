import * as taskrepo from '../../repository/tasks/taskRepo.js';
import { CreateTaskInput } from '../../model/taskModel.js';
import { UpdateTaskInput } from '../../schema/task/updateTaskSchemea.js';
import { calculateInitialReminder } from '../../utils/reminder.js';

export const createTask = (task: CreateTaskInput) => {
  const nextReminderAt = calculateInitialReminder({
    reminderDate: task.reminder_date,
    reminderTime: task.reminder_time,
    timezone: task.timezone,
    repeat: task.repeat,
  });
  return taskrepo.createTask(task, nextReminderAt);
};

export const getUserTasks = (id: number) => {
  return taskrepo.getUserTasks(id);
};

export const getTaskById = (userId: number, taskId: number) => {
  return taskrepo.getUserTaskById(userId, taskId);
};

export const getAllTasks = () => {
  return taskrepo.getAllTasks();
};

export const deleteTask = (uid: number, tid: number) => {
  return taskrepo.deleteTask(uid, tid);
};

export const updateTask = (uid: number, tid: number, data: UpdateTaskInput) => {
  return taskrepo.updateTask(uid, tid, data);
};
