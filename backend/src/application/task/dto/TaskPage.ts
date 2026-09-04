import { Task } from '../../../domain/task/entities/Task.js';

export interface TaskPage {
  tasks: Task[];
  totalItems: number;
}
