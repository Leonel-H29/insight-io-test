import { InvalidTaskStatusTransitionError } from '../exceptions/InvalidTaskStatusTransitionError.js';
import { TaskUpdateNotAllowedError } from '../exceptions/TaskUpdateNotAllowedError.js';
import { TaskStatus } from './TaskStatus.js';

export interface TaskProps {
  id: string;
  title: string;
  status: TaskStatus;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  private constructor(private readonly props: TaskProps) {}
  static create(props: TaskProps): Task {
    if (!props.title.trim()) throw new Error('Task title is required.');
    return new Task({ ...props, title: props.title.trim() });
  }
  get id(): string {
    return this.props.id;
  }
  get title(): string {
    return this.props.title;
  }
  get status(): TaskStatus {
    return this.props.status;
  }
  get ownerId(): string {
    return this.props.ownerId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  transitionTo(next: TaskStatus): Task {
    if (!this.canTransitionTo(next))
      throw new InvalidTaskStatusTransitionError(this.status, next);
    return this.copy({ status: next, updatedAt: new Date() });
  }
  canTransitionTo(next: TaskStatus): boolean {
    const allowed: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.DONE],
      [TaskStatus.DONE]: [TaskStatus.ARCHIVED],
      [TaskStatus.ARCHIVED]: [],
    };
    return allowed[this.status].includes(next);
  }
  updateTitle(title: string): Task {
    if (!title.trim()) throw new Error('Task title is required.');
    if (this.status === TaskStatus.ARCHIVED)
      throw new TaskUpdateNotAllowedError('Archived tasks cannot be edited.');
    return this.copy({ title: title.trim(), updatedAt: new Date() });
  }
  updateStatus(next: TaskStatus): Task {
    return this.transitionTo(next);
  }
  private copy(changes: Partial<TaskProps>): Task {
    return new Task({ ...this.props, ...changes });
  }
}
