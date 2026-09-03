import type { TaskStatus } from '../../../domain/task/entities/TaskStatus';
export interface TaskResult {
  id: string;
  title: string;
  status: TaskStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
