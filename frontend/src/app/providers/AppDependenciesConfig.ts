import type { AuthenticationRepository } from '../../application/task/ports/outbound/AuthenticationRepository';
import type { TaskRepository } from '../../application/task/ports/outbound/TaskRepository';
import { CreateTaskUseCase } from '../../application/task/use-cases/CreateTaskUseCase';
import { ListTasksUseCase } from '../../application/task/use-cases/ListTasksUseCase';
import { GetTaskUseCase } from '../../application/task/use-cases/GetTaskUseCase';
import { UpdateTaskUseCase } from '../../application/task/use-cases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../application/task/use-cases/DeleteTaskUseCase';
import { MarkTaskAsDoneUseCase } from '../../application/task/use-cases/MarkTaskAsDoneUseCase';
export interface AppDependenciesConfig {
  auth: AuthenticationRepository;
  tasks: TaskRepository;
  createTask: CreateTaskUseCase;
  listTasks: ListTasksUseCase;
  getTask: GetTaskUseCase;
  updateTask: UpdateTaskUseCase;
  deleteTask: DeleteTaskUseCase;
  markDone: MarkTaskAsDoneUseCase;
}
