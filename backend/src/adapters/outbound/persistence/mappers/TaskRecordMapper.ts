import { Task } from '../../../../domain/task/entities/Task.js';
import { TaskRecord } from '../models/TaskRecord.js';
export const TaskRecordMapper = {
  toDomain(r: TaskRecord): Task {
    return Task.create({
      id: r.id,
      title: r.title,
      status: r.status,
      ownerId: r.owner_id,
      createdAt: new Date(r.created_at),
      updatedAt: new Date(r.updated_at),
    });
  },
  toRecord(t: Task): TaskRecord {
    return {
      id: t.id,
      title: t.title,
      status: t.status,
      owner_id: t.ownerId,
      created_at: t.createdAt,
      updated_at: t.updatedAt,
    };
  },
};
