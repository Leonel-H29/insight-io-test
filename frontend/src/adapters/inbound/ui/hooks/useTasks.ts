import { useCallback, useEffect, useState } from 'react';
import { useAppDependencies } from '../../../../app/providers/AppContext';
import type { TaskResult } from '../../../../application/task/dto/TaskResult';
import type { UpdateTaskCommand } from '../../../../application/task/commands/UpdateTaskCommand';
export const useTasks = () => {
  const d = useAppDependencies();
  const [tasks, setTasks] = useState<TaskResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTasks(await d.listTasks.execute());
    } catch {
      setError('Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [d]);
  useEffect(() => {
    void reload();
  }, [reload]);
  const create = async (title: string) => {
    setBusy('create');
    setActionError('');
    try {
      await d.createTask.execute({ title });
      await reload();
    } catch {
      setActionError('Unable to create the task.');
    } finally {
      setBusy(null);
    }
  };
  const update = async (c: UpdateTaskCommand) => {
    setBusy(c.id);
    setActionError('');
    try {
      await d.updateTask.execute(c);
      await reload();
    } catch {
      setActionError('Unable to update the task.');
    } finally {
      setBusy(null);
    }
  };
  const remove = async (id: string) => {
    setBusy(id);
    setActionError('');
    try {
      await d.deleteTask.execute(id);
      await reload();
    } catch {
      setActionError('Unable to delete the task.');
    } finally {
      setBusy(null);
    }
  };
  const done = async (id: string) => {
    setBusy(id);
    setActionError('');
    try {
      await d.markDone.execute(id);
      await reload();
    } catch {
      setActionError('Unable to mark the task as done.');
    } finally {
      setBusy(null);
    }
  };
  return {
    tasks,
    loading,
    error,
    actionError,
    busy,
    create,
    update,
    remove,
    done,
    reload,
  };
};
