import type { TaskResult } from '../../dto/TaskResult';
import type { TaskPageResult } from '../../dto/TaskPageResult';
import type { CreateTaskCommand } from '../../commands/CreateTaskCommand';
import type { UpdateTaskCommand } from '../../commands/UpdateTaskCommand';
export interface TaskRepository {
  list(page: number, pageSize: number): Promise<TaskPageResult>;
  get(id: string): Promise<TaskResult>;
  create(command: CreateTaskCommand): Promise<TaskResult>;
  update(command: UpdateTaskCommand): Promise<TaskResult>;
  remove(id: string): Promise<void>;
  markAsDone(id: string): Promise<TaskResult>;
}
