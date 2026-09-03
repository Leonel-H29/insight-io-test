import express from 'express';
import cors from 'cors';
import { createAuth0Api } from '@auth0/auth0-express-api';
import { loadEnvironmentConfig } from '../config/settings/EnvironmentConfig.js';
import { MySqlClient } from '../infrastructure/database/MySqlClient.js';
import { MySqlTaskRepository } from '../adapters/outbound/persistence/repositories/MySqlTaskRepository.js';
import { CreateTaskUseCase } from '../application/task/use-cases/CreateTaskUseCase.js';
import { ListTasksUseCase } from '../application/task/use-cases/ListTasksUseCase.js';
import { GetTaskUseCase } from '../application/task/use-cases/GetTaskUseCase.js';
import { UpdateTaskUseCase } from '../application/task/use-cases/UpdateTaskUseCase.js';
import { DeleteTaskUseCase } from '../application/task/use-cases/DeleteTaskUseCase.js';
import { MarkTaskAsDoneUseCase } from '../application/task/use-cases/MarkTaskAsDoneUseCase.js';
import { TasksController } from '../adapters/inbound/http/controllers/TasksController.js';
import { taskRoutes } from '../adapters/inbound/http/routes/taskRoutes.js';
import { authenticationMiddleware } from '../adapters/inbound/http/middleware/AuthenticationMiddleware.js';
import { apiActivityLoggingMiddleware } from '../adapters/inbound/http/middleware/ApiActivityLoggingMiddleware.js';
import { errorHandler } from '../adapters/inbound/http/middleware/ErrorHandlerMiddleware.js';
const config = loadEnvironmentConfig();
const db = new MySqlClient(config.DATABASE_URL);
const repo = new MySqlTaskRepository(db);
const controller = new TasksController(
  new CreateTaskUseCase(repo),
  new ListTasksUseCase(repo),
  new GetTaskUseCase(repo),
  new UpdateTaskUseCase(repo),
  new DeleteTaskUseCase(repo),
  new MarkTaskAsDoneUseCase(repo)
);
const app = express();
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json({ limit: '16kb' }));
app.use(
  createAuth0Api({
    domain: config.AUTH0_DOMAIN,
    audience: config.AUTH0_AUDIENCE,
  })
);
app.use(apiActivityLoggingMiddleware(console));
app.get('/health', (_req, res) => res.json({ data: { status: 'ok' } }));
app.use('/api', authenticationMiddleware(), taskRoutes(controller));
app.use(errorHandler);
const server = app.listen(config.PORT, () =>
  console.info(`API listening on ${config.PORT}`)
);
const shutdown = async () => {
  server.close();
  await db.close();
};
process.on('SIGINT', () => {
  void shutdown();
});
process.on('SIGTERM', () => {
  void shutdown();
});
