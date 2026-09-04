import { TaskPageResult } from '../../dto/TaskPageResult.js';
export interface ListTasksPort {
  execute(page: number, pageSize: number): Promise<TaskPageResult>;
}
