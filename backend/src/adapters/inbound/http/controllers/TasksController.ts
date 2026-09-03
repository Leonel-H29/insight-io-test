import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateTaskPort } from '../../../../application/task/ports/inbound/CreateTaskPort.js';
import { ListTasksPort } from '../../../../application/task/ports/inbound/ListTasksPort.js';
import { GetTaskPort } from '../../../../application/task/ports/inbound/GetTaskPort.js';
import { UpdateTaskPort } from '../../../../application/task/ports/inbound/UpdateTaskPort.js';
import { DeleteTaskPort } from '../../../../application/task/ports/inbound/DeleteTaskPort.js';
import { MarkTaskAsDonePort } from '../../../../application/task/ports/inbound/MarkTaskAsDonePort.js';
import { createTaskSchema, updateTaskSchema } from '../dto/taskSchemas.js';
export class TasksController {
  constructor(
    private readonly createTask: CreateTaskPort,
    private readonly listTasks: ListTasksPort,
    private readonly getTask: GetTaskPort,
    private readonly updateTask: UpdateTaskPort,
    private readonly deleteTask: DeleteTaskPort,
    private readonly markDone: MarkTaskAsDonePort
  ) {}
  private actor(req: Request): string {
    if (!req.actor) throw new Error('Missing actor.');
    return req.actor.id;
  }
  private id(req: Request): string {
    return z.string().uuid().parse(req.params.taskId);
  }
  async create(req: Request, res: Response) {
    const body = createTaskSchema.parse(req.body);
    const data = await this.createTask.execute({
      title: body.title,
      ownerId: this.actor(req),
    });
    return res.status(201).json({ data });
  }
  async list(req: Request, res: Response) {
    return res.json({ data: await this.listTasks.execute(this.actor(req)) });
  }
  async get(req: Request, res: Response) {
    return res.json({
      data: await this.getTask.execute(this.id(req), this.actor(req)),
    });
  }
  async update(req: Request, res: Response) {
    const body = updateTaskSchema.parse(req.body);
    const command = {
      id: this.id(req),
      ownerId: this.actor(req),
      ...(body.title === undefined ? {} : { title: body.title }),
      ...(body.status === undefined ? {} : { status: body.status }),
    };
    return res.json({
      data: await this.updateTask.execute(command),
    });
  }
  async remove(req: Request, res: Response) {
    await this.deleteTask.execute(this.id(req), this.actor(req));
    return res.status(204).send();
  }
  async done(req: Request, res: Response) {
    return res.json({
      data: await this.markDone.execute(this.id(req), this.actor(req)),
    });
  }
}
