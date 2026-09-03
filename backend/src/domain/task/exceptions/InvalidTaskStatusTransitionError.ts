export class InvalidTaskStatusTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Invalid task status transition from ${from} to ${to}.`);
    this.name = 'InvalidTaskStatusTransitionError';
  }
}
