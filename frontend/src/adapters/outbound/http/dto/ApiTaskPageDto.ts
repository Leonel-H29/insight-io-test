import type { ApiTaskDto } from './ApiTaskDto';

export interface ApiTaskPageDto {
  tasks: ApiTaskDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
