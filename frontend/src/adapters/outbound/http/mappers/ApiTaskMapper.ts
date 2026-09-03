import type { TaskResult } from '../../../../application/task/dto/TaskResult';
import type { ApiTaskDto } from '../dto/ApiTaskDto';
export const ApiTaskMapper = {
  toApplication(dto: ApiTaskDto): TaskResult {
    return { ...dto };
  },
  fromApplication(result: TaskResult): ApiTaskDto {
    return { ...result };
  },
};
