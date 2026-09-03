import { TaskStatus } from '../../../../domain/task/entities/TaskStatus.js';
export interface TaskRecord {
  id: string;
  title: string;
  status: TaskStatus;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}
