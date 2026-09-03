import { TaskResult } from '../../dto/TaskResult.js';
export interface GetTaskPort {
  execute(id: string, ownerId: string): Promise<TaskResult>;
}
