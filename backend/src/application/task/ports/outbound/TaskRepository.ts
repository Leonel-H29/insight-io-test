import { Task } from '../../../../domain/task/entities/Task.js';
import { TaskStatus } from '../../../../domain/task/entities/TaskStatus.js';
export interface TaskRepository {
  create(task: Task): Promise<Task>;
  findByIdForOwner(id: string, ownerId: string): Promise<Task | null>;
  listByOwner(ownerId: string): Promise<Task[]>;
  updateTitle(id: string, ownerId: string, title: string): Promise<Task | null>;
  updateStatus(
    id: string,
    ownerId: string,
    from: TaskStatus,
    to: TaskStatus
  ): Promise<Task | null>;
  delete(id: string, ownerId: string): Promise<boolean>;
}
