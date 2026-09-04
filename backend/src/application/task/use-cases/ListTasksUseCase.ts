import { ListTasksPort } from '../ports/inbound/ListTasksPort.js';
import { TaskRepository } from '../ports/outbound/TaskRepository.js';
import { toTaskResult } from '../dto/TaskResultMapper.js';
import { TaskPageResult } from '../dto/TaskPageResult.js';
export class ListTasksUseCase implements ListTasksPort {
  constructor(private readonly repository: TaskRepository) {}
  async execute(page = 1, pageSize = 10): Promise<TaskPageResult> {
    const result = await this.repository.listAll(page, pageSize);
    return {
      tasks: result.tasks.map(toTaskResult),
      page,
      pageSize,
      totalItems: result.totalItems,
      totalPages: Math.ceil(result.totalItems / pageSize),
    };
  }
}
