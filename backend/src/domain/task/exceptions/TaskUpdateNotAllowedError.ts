export class TaskUpdateNotAllowedError extends Error {
  constructor(message = 'Only the title may be corrected on a DONE task.') {
    super(message);
    this.name = 'TaskUpdateNotAllowedError';
  }
}
