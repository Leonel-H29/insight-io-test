import type { DeleteTaskPort } from '../ports/inbound/DeleteTaskPort';
import type { TaskRepository } from '../ports/outbound/TaskRepository';
export class DeleteTaskUseCase implements DeleteTaskPort {
  constructor(private readonly r: TaskRepository) {}
  execute(id: string): Promise<void> {
    return this.r.remove(id);
  }
}
