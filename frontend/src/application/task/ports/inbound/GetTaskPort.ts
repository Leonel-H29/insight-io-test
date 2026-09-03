import type { TaskResult } from '../../dto/TaskResult';
export interface GetTaskPort {
  execute(id: string): Promise<TaskResult>;
}
