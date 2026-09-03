import { ListTasksPort } from '../ports/inbound/ListTasksPort.js';
import { TaskRepository } from '../ports/outbound/TaskRepository.js';
import { TaskResult } from '../dto/TaskResult.js';
import { toTaskResult } from '../dto/TaskResultMapper.js';
export class ListTasksUseCase implements ListTasksPort {
  constructor(private readonly repository: TaskRepository) {}
  async execute(ownerId: string): Promise<TaskResult[]> {
    return (await this.repository.listByOwner(ownerId)).map(toTaskResult);
  }
}
