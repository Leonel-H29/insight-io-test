import type { TaskResult } from '../../../../application/task/dto/TaskResult';
export interface TaskViewModel {
  id: string;
  title: string;
  ownerId: string;
  ownerUsername: string;
  updatedAt: string;
  status: string;
  isOwner: boolean;
  canStart: boolean;
  canDone: boolean;
  canArchive: boolean;
  canEdit: boolean;
}
export const toTaskViewModel = (
  task: TaskResult,
  currentUserId: string,
  ownerUsername: string
): TaskViewModel => ({
  id: task.id,
  title: task.title,
  ownerId: task.ownerId,
  ownerUsername,
  updatedAt: task.updatedAt,
  status: task.status,
  isOwner: task.ownerId === currentUserId,
  canStart: task.ownerId === currentUserId && task.status === 'PENDING',
  canDone: task.ownerId === currentUserId && task.status === 'IN_PROGRESS',
  canArchive: task.ownerId === currentUserId && task.status === 'DONE',
  canEdit: task.ownerId === currentUserId && task.status !== 'ARCHIVED',
});
