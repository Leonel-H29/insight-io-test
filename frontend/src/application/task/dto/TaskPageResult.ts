import type { TaskResult } from './TaskResult';

export interface TaskPageResult {
  tasks: TaskResult[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
