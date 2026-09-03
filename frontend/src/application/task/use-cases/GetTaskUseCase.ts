import type { GetTaskPort } from '../ports/inbound/GetTaskPort';
import type { TaskRepository } from '../ports/outbound/TaskRepository';
import type { TaskResult } from '../dto/TaskResult';
export class GetTaskUseCase implements GetTaskPort {
  constructor(private readonly r: TaskRepository) {}
  execute(id: string): Promise<TaskResult> {
    return this.r.get(id);
  }
}
