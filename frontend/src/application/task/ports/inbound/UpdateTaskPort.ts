import type { UpdateTaskCommand } from '../../commands/UpdateTaskCommand';
import type { TaskResult } from '../../dto/TaskResult';
export interface UpdateTaskPort {
  execute(command: UpdateTaskCommand): Promise<TaskResult>;
}
