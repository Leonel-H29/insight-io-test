import { Router } from 'express';
import { TasksController } from '../controllers/TasksController.js';
export const taskRoutes = (c: TasksController): Router => {
  const r = Router();
  r.post('/tasks', (req, res, next) => c.create(req, res).catch(next));
  r.get('/tasks', (req, res, next) => c.list(req, res).catch(next));
  r.get('/tasks/:taskId', (req, res, next) => c.get(req, res).catch(next));
  r.patch('/tasks/:taskId', (req, res, next) => c.update(req, res).catch(next));
  r.delete('/tasks/:taskId', (req, res, next) =>
    c.remove(req, res).catch(next)
  );
  r.patch('/tasks/:taskId/done', (req, res, next) =>
    c.done(req, res).catch(next)
  );
  return r;
};
