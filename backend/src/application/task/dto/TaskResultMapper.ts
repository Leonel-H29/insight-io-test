import { Task } from '../../../domain/task/entities/Task.js';
import { TaskResult } from './TaskResult.js';
export function toTaskResult(task: Task): TaskResult {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    ownerId: task.ownerId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
