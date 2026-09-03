import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { TaskNotFoundError } from '../../../../application/task/exceptions/TaskNotFoundError.js';
import { InvalidTaskStatusTransitionError } from '../../../../domain/task/exceptions/InvalidTaskStatusTransitionError.js';
import { TaskUpdateNotAllowedError } from '../../../../domain/task/exceptions/TaskUpdateNotAllowedError.js';
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data.',
        details: err.issues.map((i) => ({
          path: i.path,
          message: i.message,
        })),
      },
    });
    return;
  }
  if (err instanceof TaskNotFoundError) {
    res
      .status(404)
      .json({ error: { code: 'TASK_NOT_FOUND', message: err.message } });
    return;
  }
  if (
    err instanceof InvalidTaskStatusTransitionError ||
    err instanceof TaskUpdateNotAllowedError
  ) {
    res.status(409).json({
      error: { code: 'BUSINESS_RULE_VIOLATION', message: err.message },
    });
    return;
  }
  console.error(err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
};
