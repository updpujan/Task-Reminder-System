import * as taskrepo from '../../repository/tasks/taskRepo.js';
import { CreateTaskInput } from '../../model/taskModel.js';

export const createTask = (task: CreateTaskInput) => {
  return taskrepo.createTask(task);
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
