import { TaskStatus } from '../../../domain/task/entities/TaskStatus.js';
export interface UpdateTaskCommand {
  id: string;
  ownerId: string;
  title?: string;
  status?: TaskStatus;
}
