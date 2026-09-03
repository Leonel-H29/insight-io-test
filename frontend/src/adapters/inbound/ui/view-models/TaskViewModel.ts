import type { TaskResult } from '../../../../application/task/dto/TaskResult';
export interface TaskViewModel {
  id: string;
  title: string;
  ownerUsername: string;
  updatedAt: string;
  status: string;
  canStart: boolean;
  canDone: boolean;
  canArchive: boolean;
  canEdit: boolean;
}
export const toTaskViewModel = (
  task: TaskResult,
  ownerUsername: string
): TaskViewModel => ({
  id: task.id,
  title: task.title,
  ownerUsername,
  updatedAt: task.updatedAt,
  status: task.status,
  canStart: task.status === 'PENDING',
  canDone: task.status === 'IN_PROGRESS',
  canArchive: task.status === 'DONE',
  canEdit: task.status !== 'ARCHIVED',
});
