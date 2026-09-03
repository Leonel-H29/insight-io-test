import type { UpdateTaskPort } from '../ports/inbound/UpdateTaskPort';
import type { TaskRepository } from '../ports/outbound/TaskRepository';
import type { UpdateTaskCommand } from '../commands/UpdateTaskCommand';
import type { TaskResult } from '../dto/TaskResult';
export class UpdateTaskUseCase implements UpdateTaskPort {
  constructor(private readonly r: TaskRepository) {}
  execute(c: UpdateTaskCommand): Promise<TaskResult> {
    return this.r.update(c);
  }
}
