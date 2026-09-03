import type { TaskResult } from '../../dto/TaskResult';
export interface ListTasksPort {
  execute(): Promise<TaskResult[]>;
}
