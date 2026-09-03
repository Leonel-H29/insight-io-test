import { CreateTaskCommand } from '../../commands/CreateTaskCommand.js';
import { TaskResult } from '../../dto/TaskResult.js';
export interface CreateTaskPort {
  execute(command: CreateTaskCommand): Promise<TaskResult>;
}
