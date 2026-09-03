import { Task } from '../../../src/domain/task/entities/Task.js';
import { TaskStatus } from '../../../src/domain/task/entities/TaskStatus.js';
import { InvalidTaskStatusTransitionError } from '../../../src/domain/task/exceptions/InvalidTaskStatusTransitionError.js';
import { TaskUpdateNotAllowedError } from '../../../src/domain/task/exceptions/TaskUpdateNotAllowedError.js';
const task = () =>
  Task.create({
    id: '1',
    title: 'Test',
    status: TaskStatus.PENDING,
    ownerId: 'u1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });
describe('Task', () => {
  it('allows the required status progression', () => {
    const inProgress = task().transitionTo(TaskStatus.IN_PROGRESS);
    const done = inProgress.transitionTo(TaskStatus.DONE);
    expect(done.status).toBe(TaskStatus.DONE);
    expect(done.transitionTo(TaskStatus.ARCHIVED).status).toBe(
      TaskStatus.ARCHIVED
    );
  });
  it('rejects invalid transitions', () =>
    expect(() => task().transitionTo(TaskStatus.DONE)).toThrow(
      InvalidTaskStatusTransitionError
    ));
  it('allows title correction on DONE', () => {
    const done = task()
      .transitionTo(TaskStatus.IN_PROGRESS)
      .transitionTo(TaskStatus.DONE);
    expect(done.updateTitle('Corrected').title).toBe('Corrected');
  });
  it('rejects edits on ARCHIVED', () => {
    const archived = task()
      .transitionTo(TaskStatus.IN_PROGRESS)
      .transitionTo(TaskStatus.DONE)
      .transitionTo(TaskStatus.ARCHIVED);
    expect(() => archived.updateTitle('Nope')).toThrow(
      TaskUpdateNotAllowedError
    );
  });
});
