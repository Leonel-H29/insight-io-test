export class TaskCompletionNotAllowedError extends Error {
  constructor() {
    super('Only the task owner can mark a task as done.');
    this.name = 'TaskCompletionNotAllowedError';
  }
}
