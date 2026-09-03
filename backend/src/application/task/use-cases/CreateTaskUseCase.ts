import { randomUUID } from 'node:crypto';
import { Task } from '../../../domain/task/entities/Task.js';
import { TaskStatus } from '../../../domain/task/entities/TaskStatus.js';
import { CreateTaskPort } from '../ports/inbound/CreateTaskPort.js';
import { CreateTaskCommand } from '../commands/CreateTaskCommand.js';
import { TaskRepository } from '../ports/outbound/TaskRepository.js';
import { TaskResult } from '../dto/TaskResult.js';
import { toTaskResult } from '../dto/TaskResultMapper.js';
export class CreateTaskUseCase implements CreateTaskPort {
  constructor(private readonly repository: TaskRepository) {}
  async execute(command: CreateTaskCommand): Promise<TaskResult> {
    const now = new Date();
    const task = Task.create({
      id: randomUUID(),
      title: command.title,
      status: TaskStatus.PENDING,
      ownerId: command.ownerId,
      createdAt: now,
      updatedAt: now,
    });
    return toTaskResult(await this.repository.create(task));
  }
}
