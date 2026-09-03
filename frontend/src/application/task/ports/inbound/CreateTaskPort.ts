import type { CreateTaskCommand } from '../../commands/CreateTaskCommand';
import type { TaskResult } from '../../dto/TaskResult';
export interface CreateTaskPort {
  execute(command: CreateTaskCommand): Promise<TaskResult>;
}
