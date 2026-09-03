import type { TaskResult } from '../../dto/TaskResult';
export interface MarkTaskAsDonePort {
  execute(id: string): Promise<TaskResult>;
}
