import { DeleteTaskPort } from '../ports/inbound/DeleteTaskPort.js';
import { TaskRepository } from '../ports/outbound/TaskRepository.js';
import { TaskNotFoundError } from '../exceptions/TaskNotFoundError.js';
export class DeleteTaskUseCase implements DeleteTaskPort {
  constructor(private readonly repository: TaskRepository) {}
  async execute(id: string, ownerId: string): Promise<void> {
    if (!(await this.repository.delete(id, ownerId)))
      throw new TaskNotFoundError();
  }
}
