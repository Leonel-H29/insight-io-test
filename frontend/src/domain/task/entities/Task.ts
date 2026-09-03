import type { TaskStatus } from './TaskStatus';
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
