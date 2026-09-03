import type { ListTasksPort } from '../ports/inbound/ListTasksPort';
import type { TaskRepository } from '../ports/outbound/TaskRepository';
import type { TaskResult } from '../dto/TaskResult';
export class ListTasksUseCase implements ListTasksPort {
  constructor(private readonly r: TaskRepository) {}
  execute(): Promise<TaskResult[]> {
    return this.r.list();
  }
}
