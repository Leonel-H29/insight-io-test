import { CreateTaskUseCase } from '../../../src/application/task/use-cases/CreateTaskUseCase.js';
import { TaskRepository } from '../../../src/application/task/ports/outbound/TaskRepository.js';
import { TaskStatus } from '../../../src/domain/task/entities/TaskStatus.js';

const repository = (capture: (ownerId: string) => void): TaskRepository => ({
  create: async (task) => {
    capture(task.ownerId);
    return task;
  },
  findById: async () => null,
  findByIdForOwner: async () => null,
  listAll: async () => ({ tasks: [], totalItems: 0 }),
  listByOwner: async () => [],
  updateTitle: async () => null,
  updateStatus: async () => null,
  delete: async () => false,
});

describe('CreateTaskUseCase', () => {
  it('persists the owner supplied by the authenticated application boundary', async () => {
    let ownerId = '';
    const result = await new CreateTaskUseCase(
      repository((value) => (ownerId = value))
    ).execute({
      title: 'Owned task',
      ownerId: 'user-a',
    });

    expect(ownerId).toBe('user-a');
    expect(result.ownerId).toBe('user-a');
    expect(result.status).toBe(TaskStatus.PENDING);
  });
});
