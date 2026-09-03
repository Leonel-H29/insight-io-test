import type { AuthenticationRepository } from '../../application/task/ports/outbound/AuthenticationRepository';
import { HttpTaskRepository } from '../../adapters/outbound/http/repositories/HttpTaskRepository';
import { CreateTaskUseCase } from '../../application/task/use-cases/CreateTaskUseCase';
import { ListTasksUseCase } from '../../application/task/use-cases/ListTasksUseCase';
import { GetTaskUseCase } from '../../application/task/use-cases/GetTaskUseCase';
import { UpdateTaskUseCase } from '../../application/task/use-cases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../application/task/use-cases/DeleteTaskUseCase';
import { MarkTaskAsDoneUseCase } from '../../application/task/use-cases/MarkTaskAsDoneUseCase';
import type { AppDependenciesConfig } from './AppDependenciesConfig';
export const createAppDependencies = (
  auth: AuthenticationRepository
): AppDependenciesConfig => {
  const tasks = new HttpTaskRepository(auth);
  return {
    auth,
    tasks,
    createTask: new CreateTaskUseCase(tasks),
    listTasks: new ListTasksUseCase(tasks),
    getTask: new GetTaskUseCase(tasks),
    updateTask: new UpdateTaskUseCase(tasks),
    deleteTask: new DeleteTaskUseCase(tasks),
    markDone: new MarkTaskAsDoneUseCase(tasks),
  };
};
