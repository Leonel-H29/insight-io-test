import { TaskResult } from '../../dto/TaskResult.js';
export interface ListTasksPort {
  execute(ownerId: string): Promise<TaskResult[]>;
}
