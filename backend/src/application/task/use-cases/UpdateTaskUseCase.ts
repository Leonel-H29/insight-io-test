import { UpdateTaskPort } from '../ports/inbound/UpdateTaskPort.js';
import { TaskRepository } from '../ports/outbound/TaskRepository.js';
import { UpdateTaskCommand } from '../commands/UpdateTaskCommand.js';
import { TaskResult } from '../dto/TaskResult.js';
import { toTaskResult } from '../dto/TaskResultMapper.js';
import { TaskNotFoundError } from '../exceptions/TaskNotFoundError.js';
import { TaskStatus } from '../../../domain/task/entities/TaskStatus.js';
import { TaskUpdateNotAllowedError } from '../../../domain/task/exceptions/TaskUpdateNotAllowedError.js';
export class UpdateTaskUseCase implements UpdateTaskPort {
  constructor(private readonly repository: TaskRepository) {}
  async execute(command: UpdateTaskCommand): Promise<TaskResult> {
    const task = await this.repository.findByIdForOwner(
      command.id,
      command.ownerId
    );
    if (!task) throw new TaskNotFoundError();
    if (
      task.status === TaskStatus.DONE &&
      ((command.status !== undefined &&
        command.status !== TaskStatus.ARCHIVED) ||
        command.title !== undefined)
    )
      throw new TaskUpdateNotAllowedError();
    if (command.status !== undefined && command.status !== task.status) {
      const next = task.updateStatus(command.status);
      const saved = await this.repository.updateStatus(
        command.id,
        command.ownerId,
        task.status,
        next.status
      );
      if (!saved) throw new TaskNotFoundError();
      return toTaskResult(saved);
    }
    if (command.title !== undefined) {
      const next = task.updateTitle(command.title);
      const saved = await this.repository.updateTitle(
        command.id,
        command.ownerId,
        next.title
      );
      if (!saved) throw new TaskNotFoundError();
      return toTaskResult(saved);
    }
    return toTaskResult(task);
  }
}
