import { TaskResult } from './TaskResult.js';

export interface TaskPageResult {
  tasks: TaskResult[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
