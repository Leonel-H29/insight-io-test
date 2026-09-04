import { z } from 'zod';
import { TaskStatus } from '../../../../domain/task/entities/TaskStatus.js';
export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(255),
});
export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
  })
  .strict()
  .refine((v) => v.title !== undefined || v.status !== undefined, {
    message: 'At least one field is required.',
  });
export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});
