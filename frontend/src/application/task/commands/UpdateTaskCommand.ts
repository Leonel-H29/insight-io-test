import type { TaskStatus } from '../../../domain/task/entities/TaskStatus';
export interface UpdateTaskCommand {
  id: string;
  title?: string;
  status?: TaskStatus;
}
