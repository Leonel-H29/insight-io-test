import { TaskStatus } from '../../../domain/task/entities/TaskStatus.js';
export interface TaskResult {
  id: string;
  title: string;
  status: TaskStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
