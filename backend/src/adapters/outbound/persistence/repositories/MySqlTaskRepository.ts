import { Task } from '../../../../domain/task/entities/Task.js';
import { TaskStatus } from '../../../../domain/task/entities/TaskStatus.js';
import { TaskRepository } from '../../../../application/task/ports/outbound/TaskRepository.js';
import { MySqlClient } from '../../../../infrastructure/database/MySqlClient.js';
import { TaskRecordMapper } from '../mappers/TaskRecordMapper.js';
import { TaskPage } from '../../../../application/task/dto/TaskPage.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
interface TaskRow extends RowDataPacket {
  id: string;
  title: string;
  status: TaskStatus;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}
export class MySqlTaskRepository implements TaskRepository {
  constructor(private readonly db: MySqlClient) {}
  async create(t: Task): Promise<Task> {
    const r = TaskRecordMapper.toRecord(t);
    await this.db.pool.execute(
      'INSERT INTO tasks (id,title,status,owner_id,created_at,updated_at) VALUES (?,?,?,?,?,?)',
      [r.id, r.title, r.status, r.owner_id, r.created_at, r.updated_at]
    );
    return t;
  }
  async findById(id: string): Promise<Task | null> {
    const [rows] = await this.db.pool.execute<TaskRow[]>(
      'SELECT id,title,status,owner_id,created_at,updated_at FROM tasks WHERE id=? LIMIT 1',
      [id]
    );
    return rows[0] ? TaskRecordMapper.toDomain(rows[0]) : null;
  }
  async findByIdForOwner(id: string, ownerId: string): Promise<Task | null> {
    const [rows] = await this.db.pool.execute<TaskRow[]>(
      'SELECT id,title,status,owner_id,created_at,updated_at FROM tasks WHERE id=? AND owner_id=? LIMIT 1',
      [id, ownerId]
    );
    return rows[0] ? TaskRecordMapper.toDomain(rows[0]) : null;
  }
  async listAll(page: number, pageSize: number): Promise<TaskPage> {
    const offset = (page - 1) * pageSize;
    const [rows] = await this.db.pool.execute<TaskRow[]>(
      'SELECT id,title,status,owner_id,created_at,updated_at FROM tasks ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [pageSize, offset]
    );
    const [countRows] = await this.db.pool.execute<
      (RowDataPacket & { total: number })[]
    >('SELECT COUNT(*) AS total FROM tasks');
    return {
      tasks: rows.map(TaskRecordMapper.toDomain),
      totalItems: countRows[0]?.total ?? 0,
    };
  }
  async listByOwner(ownerId: string): Promise<Task[]> {
    const [rows] = await this.db.pool.execute<TaskRow[]>(
      'SELECT id,title,status,owner_id,created_at,updated_at FROM tasks WHERE owner_id=? ORDER BY created_at DESC',
      [ownerId]
    );
    return rows.map(TaskRecordMapper.toDomain);
  }
  async updateTitle(
    id: string,
    ownerId: string,
    title: string
  ): Promise<Task | null> {
    const [r] = await this.db.pool.execute<ResultSetHeader>(
      'UPDATE tasks SET title=?,updated_at=CURRENT_TIMESTAMP(3) WHERE id=? AND owner_id=?',
      [title, id, ownerId]
    );
    return r.affectedRows ? this.findByIdForOwner(id, ownerId) : null;
  }
  async updateStatus(
    id: string,
    ownerId: string,
    from: TaskStatus,
    to: TaskStatus
  ): Promise<Task | null> {
    const [r] = await this.db.pool.execute<ResultSetHeader>(
      'UPDATE tasks SET status=?,updated_at=CURRENT_TIMESTAMP(3) WHERE id=? AND owner_id=? AND status=?',
      [to, id, ownerId, from]
    );
    return r.affectedRows ? this.findByIdForOwner(id, ownerId) : null;
  }
  async delete(id: string, ownerId: string): Promise<boolean> {
    const [r] = await this.db.pool.execute<ResultSetHeader>(
      'DELETE FROM tasks WHERE id=? AND owner_id=?',
      [id, ownerId]
    );
    return r.affectedRows === 1;
  }
}
