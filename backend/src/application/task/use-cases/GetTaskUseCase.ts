import { GetTaskPort } from '../ports/inbound/GetTaskPort.js';
import { TaskRepository } from '../ports/outbound/TaskRepository.js';
import { TaskResult } from '../dto/TaskResult.js';
import { toTaskResult } from '../dto/TaskResultMapper.js';
import { TaskNotFoundError } from '../exceptions/TaskNotFoundError.js';
export class GetTaskUseCase implements GetTaskPort {
  constructor(private readonly repository: TaskRepository) {}
  async execute(id: string, ownerId: string): Promise<TaskResult> {
    const task = await this.repository.findByIdForOwner(id, ownerId);
    if (!task) throw new TaskNotFoundError();
    return toTaskResult(task);
  }
}
