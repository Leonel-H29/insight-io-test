import { ListTasksUseCase } from '../../../src/application/task/use-cases/ListTasksUseCase.js';
import { Task } from '../../../src/domain/task/entities/Task.js';
import { TaskStatus } from '../../../src/domain/task/entities/TaskStatus.js';
import { TaskRepository } from '../../../src/application/task/ports/outbound/TaskRepository.js';

const makeTasks = (): Task[] => [
  Task.create({
    id: 'task-a',
    title: 'Task A',
    status: TaskStatus.PENDING,
    ownerId: 'user-a',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  }),
  Task.create({
    id: 'task-b',
    title: 'Task B',
    status: TaskStatus.IN_PROGRESS,
    ownerId: 'user-b',
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-02'),
  }),
  Task.create({
    id: 'task-c',
    title: 'Task C',
    status: TaskStatus.DONE,
    ownerId: 'user-c',
    createdAt: new Date('2026-01-03'),
    updatedAt: new Date('2026-01-03'),
  }),
];

const sharedRepository = (tasks: Task[]): TaskRepository => ({
  create: async (task) => task,
  findById: async (id) => tasks.find((task) => task.id === id) ?? null,
  findByIdForOwner: async (id, ownerId) =>
    tasks.find((task) => task.id === id && task.ownerId === ownerId) ?? null,
  listAll: async () => ({ tasks, totalItems: tasks.length }),
  listByOwner: async (ownerId) =>
    tasks.filter((task) => task.ownerId === ownerId),
  updateTitle: async () => null,
  updateStatus: async () => null,
  delete: async () => false,
});

describe('ListTasksUseCase', () => {
  it('returns the complete shared collection for any authenticated caller', async () => {
    const repository = sharedRepository(makeTasks());
    const useCase = new ListTasksUseCase(repository);

    const userAResults = await useCase.execute(1, 10);
    const userBResults = await useCase.execute(1, 10);

    expect(userAResults.tasks.map((task) => task.ownerId)).toEqual([
      'user-a',
      'user-b',
      'user-c',
    ]);
    expect(userBResults).toEqual(userAResults);
  });

  it('uses the shared repository operation instead of an owner-scoped query', async () => {
    const tasks = makeTasks();
    const repository = sharedRepository(tasks);
    const listAll = jest.spyOn(repository, 'listAll');
    const listByOwner = jest.spyOn(repository, 'listByOwner');

    await new ListTasksUseCase(repository).execute(1, 10);

    expect(listAll).toHaveBeenCalledTimes(1);
    expect(listByOwner).not.toHaveBeenCalled();
  });
});
