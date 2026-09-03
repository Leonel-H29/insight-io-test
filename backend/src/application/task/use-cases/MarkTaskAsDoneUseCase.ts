import { MarkTaskAsDonePort } from '../ports/inbound/MarkTaskAsDonePort.js';
import { TaskRepository } from '../ports/outbound/TaskRepository.js';
import { TaskResult } from '../dto/TaskResult.js';
import { toTaskResult } from '../dto/TaskResultMapper.js';
import { TaskNotFoundError } from '../exceptions/TaskNotFoundError.js';
import { TaskStatus } from '../../../domain/task/entities/TaskStatus.js';
import { InvalidTaskStatusTransitionError } from '../../../domain/task/exceptions/InvalidTaskStatusTransitionError.js';
export class MarkTaskAsDoneUseCase implements MarkTaskAsDonePort {
  constructor(private readonly repository: TaskRepository) {}
  async execute(id: string, ownerId: string): Promise<TaskResult> {
    const task = await this.repository.findByIdForOwner(id, ownerId);
    if (!task) throw new TaskNotFoundError();
    if (task.status === TaskStatus.DONE) return toTaskResult(task);
    if (!task.canTransitionTo(TaskStatus.DONE))
      throw new InvalidTaskStatusTransitionError(task.status, TaskStatus.DONE);
    const updated = await this.repository.updateStatus(
      id,
      ownerId,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE
    );
    if (updated) return toTaskResult(updated);
    const current = await this.repository.findByIdForOwner(id, ownerId);
    if (current?.status === TaskStatus.DONE) return toTaskResult(current);
    if (!current) throw new TaskNotFoundError();
    throw new InvalidTaskStatusTransitionError(current.status, TaskStatus.DONE);
  }
}
