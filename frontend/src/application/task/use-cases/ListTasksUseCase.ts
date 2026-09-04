import type { ListTasksPort } from '../ports/inbound/ListTasksPort';
import type { TaskRepository } from '../ports/outbound/TaskRepository';
import type { TaskPageResult } from '../dto/TaskPageResult';
export class ListTasksUseCase implements ListTasksPort {
  constructor(private readonly r: TaskRepository) {}
  execute(page: number, pageSize: number): Promise<TaskPageResult> {
    return this.r.list(page, pageSize);
  }
}
