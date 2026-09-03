import type { TaskRepository } from '../../../../application/task/ports/outbound/TaskRepository';
import type { CreateTaskCommand } from '../../../../application/task/commands/CreateTaskCommand';
import type { UpdateTaskCommand } from '../../../../application/task/commands/UpdateTaskCommand';
import type { TaskResult } from '../../../../application/task/dto/TaskResult';
import type { ApiTaskDto } from '../dto/ApiTaskDto';
import { ApiTaskMapper } from '../mappers/ApiTaskMapper';
import type { AuthenticationRepository } from '../../../../application/task/ports/outbound/AuthenticationRepository';
import { Environment } from '../../../../infrastructure/config/Environment';
export class HttpTaskRepository implements TaskRepository {
  constructor(private readonly auth: AuthenticationRepository) {}
  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.auth.getAccessToken();
    if (!token) throw new Error('Authentication required.');
    const response = await fetch(`${Environment.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      throw new Error(body?.error?.message ?? 'Request failed.');
    }
    if (response.status === 204) return undefined as T;
    const body = (await response.json()) as { data: T };
    return body.data;
  }
  async list(): Promise<TaskResult[]> {
    const data = await this.request<ApiTaskDto[]>('/api/tasks');
    return data.map(ApiTaskMapper.toApplication);
  }
  async get(id: string): Promise<TaskResult> {
    return ApiTaskMapper.toApplication(
      await this.request<ApiTaskDto>(`/api/tasks/${id}`)
    );
  }
  async create(c: CreateTaskCommand): Promise<TaskResult> {
    return ApiTaskMapper.toApplication(
      await this.request<ApiTaskDto>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(c),
      })
    );
  }
  async update(c: UpdateTaskCommand): Promise<TaskResult> {
    const { id, ...body } = c;
    return ApiTaskMapper.toApplication(
      await this.request<ApiTaskDto>(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
    );
  }
  async remove(id: string): Promise<void> {
    await this.request<void>(`/api/tasks/${id}`, { method: 'DELETE' });
  }
  async markAsDone(id: string): Promise<TaskResult> {
    return ApiTaskMapper.toApplication(
      await this.request<ApiTaskDto>(`/api/tasks/${id}/done`, {
        method: 'PATCH',
      })
    );
  }
}
