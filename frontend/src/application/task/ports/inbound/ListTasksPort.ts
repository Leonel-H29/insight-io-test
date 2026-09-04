import type { TaskPageResult } from '../../dto/TaskPageResult';
export interface ListTasksPort {
  execute(page: number, pageSize: number): Promise<TaskPageResult>;
}
