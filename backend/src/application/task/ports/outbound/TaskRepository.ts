import { Task } from '../../../../domain/task/entities/Task.js';
import { TaskStatus } from '../../../../domain/task/entities/TaskStatus.js';
import { TaskPage } from '../../dto/TaskPage.js';
export interface TaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByIdForOwner(id: string, ownerId: string): Promise<Task | null>;
  listAll(page: number, pageSize: number): Promise<TaskPage>;
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
