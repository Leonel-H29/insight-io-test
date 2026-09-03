import type { MarkTaskAsDonePort } from '../ports/inbound/MarkTaskAsDonePort';
import type { TaskRepository } from '../ports/outbound/TaskRepository';
import type { TaskResult } from '../dto/TaskResult';
export class MarkTaskAsDoneUseCase implements MarkTaskAsDonePort {
  constructor(private readonly r: TaskRepository) {}
  execute(id: string): Promise<TaskResult> {
    return this.r.markAsDone(id);
  }
}
