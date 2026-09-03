import { MarkTaskAsDoneUseCase } from '../../../src/application/task/use-cases/MarkTaskAsDoneUseCase.js';
import { Task } from '../../../src/domain/task/entities/Task.js';
import { TaskStatus } from '../../../src/domain/task/entities/TaskStatus.js';
import { TaskRepository } from '../../../src/application/task/ports/outbound/TaskRepository.js';
const makeTask = (status: TaskStatus) =>
  Task.create({
    id: '1',
    title: 'Task',
    status,
    ownerId: 'u1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });
const fake = (initial: Task): TaskRepository => {
  let current = initial;
  return {
    create: async (t) => t,
    findByIdForOwner: async (id, o) =>
      id === current.id && o === current.ownerId ? current : null,
    listByOwner: async () => [current],
    updateTitle: async () => current,
    updateStatus: async (_id, _o, from, to) => {
      if (current.status !== from) return null;
      current = current.transitionTo(to);
      return current;
    },
    delete: async () => true,
  };
};
describe('MarkTaskAsDoneUseCase', () => {
  it('marks an owned IN_PROGRESS task as DONE', async () => {
    const result = await new MarkTaskAsDoneUseCase(
      fake(makeTask(TaskStatus.IN_PROGRESS))
    ).execute('1', 'u1');
    expect(result.status).toBe(TaskStatus.DONE);
  });
  it('is idempotent when already DONE', async () => {
    const result = await new MarkTaskAsDoneUseCase(
      fake(makeTask(TaskStatus.DONE))
    ).execute('1', 'u1');
    expect(result.status).toBe(TaskStatus.DONE);
  });
  it('handles concurrent completion attempts idempotently', async () => {
    const repository = fake(makeTask(TaskStatus.IN_PROGRESS));
    const useCase = new MarkTaskAsDoneUseCase(repository);
    const results = await Promise.all([
      useCase.execute('1', 'u1'),
      useCase.execute('1', 'u1'),
    ]);
    expect(results).toHaveLength(2);
    expect(results.every((result) => result.status === TaskStatus.DONE)).toBe(
      true
    );
  });
  it('does not allow a different owner', async () => {
    await expect(
      new MarkTaskAsDoneUseCase(fake(makeTask(TaskStatus.IN_PROGRESS))).execute(
        '1',
        'u2'
      )
    ).rejects.toThrow('Task not found');
  });
});
