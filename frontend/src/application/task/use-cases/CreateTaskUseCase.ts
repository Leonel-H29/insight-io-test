import type { CreateTaskPort } from '../ports/inbound/CreateTaskPort';
import type { TaskRepository } from '../ports/outbound/TaskRepository';
import type { CreateTaskCommand } from '../commands/CreateTaskCommand';
import type { TaskResult } from '../dto/TaskResult';
export class CreateTaskUseCase implements CreateTaskPort {
  constructor(private readonly r: TaskRepository) {}
  execute(c: CreateTaskCommand): Promise<TaskResult> {
    return this.r.create(c);
  }
}
