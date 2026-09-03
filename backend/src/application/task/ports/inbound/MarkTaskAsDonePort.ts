import { TaskResult } from '../../dto/TaskResult.js';
export interface MarkTaskAsDonePort {
  execute(id: string, ownerId: string): Promise<TaskResult>;
}
