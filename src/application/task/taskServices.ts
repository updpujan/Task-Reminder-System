import * as taskrepo from '../../repository/tasks/taskRepo.js';
import { CreateTaskInput } from '../../model/taskModel.js';

export const createTask = async (task: CreateTaskInput) => {
  return await taskrepo.createTask(task);
};
