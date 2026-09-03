import { UpdateTaskCommand } from '../../commands/UpdateTaskCommand.js';
import { TaskResult } from '../../dto/TaskResult.js';
export interface UpdateTaskPort {
  execute(command: UpdateTaskCommand): Promise<TaskResult>;
}
