import { useCallback, useEffect, useState } from 'react';
import { useAppDependencies } from '../../../../app/providers/AppContext';
import { useToast } from './useToast';
import type { TaskResult } from '../../../../application/task/dto/TaskResult';
import type { TaskPageResult } from '../../../../application/task/dto/TaskPageResult';
import type { UpdateTaskCommand } from '../../../../application/task/commands/UpdateTaskCommand';
export const useTasks = () => {
  const d = useAppDependencies();
  const toast = useToast();
  const [tasks, setTasks] = useState<TaskResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const pageSize = 10;
  const load = useCallback(
    async (requestedPage: number, isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');
      try {
        const result: TaskPageResult = await d.listTasks.execute(
          requestedPage,
          pageSize
        );
        setTasks(result.tasks);
        setPage(result.page);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
        return result;
      } catch (loadError) {
        if (!isRefresh) setError('Unable to load tasks.');
        throw loadError;
      } finally {
        if (isRefresh) setRefreshing(false);
        else setLoading(false);
      }
    },
    [d]
  );
  useEffect(() => {
    void load(page).catch(() => undefined);
  }, [load, page]);
  const reload = useCallback(async () => {
    await load(page).catch(() => undefined);
  }, [load, page]);
  const refresh = async () => {
    try {
      await load(page, true);
      toast.success('Tasks refreshed', 'The latest tasks are now displayed.');
    } catch {
      toast.error('Refresh failed', 'Unable to fetch the latest tasks.');
    }
  };
  const goToPage = (nextPage: number) => {
    if (nextPage >= 1 && nextPage <= totalPages && nextPage !== page)
      setPage(nextPage);
  };
  const create = async (title: string) => {
    setBusy('create');
    setActionError('');
    try {
      await d.createTask.execute({ title });
      toast.success(
        'Task created',
        'Your new task has been added successfully.'
      );
      await reload();
    } catch {
      setActionError('Unable to create the task.');
      toast.error('Failed to create task', 'Please try again.');
    } finally {
      setBusy(null);
    }
  };
  const update = async (c: UpdateTaskCommand) => {
    setBusy(c.id);
    setActionError('');
    try {
      await d.updateTask.execute(c);
      toast.success('Task updated', 'Your changes have been saved.');
      await reload();
    } catch {
      setActionError('Unable to update the task.');
      toast.error('Failed to update task', 'Please try again.');
    } finally {
      setBusy(null);
    }
  };
  const remove = async (id: string) => {
    setBusy(id);
    setActionError('');
    try {
      await d.deleteTask.execute(id);
      toast.success('Task deleted', 'The task has been removed.');
      await reload();
    } catch {
      setActionError('Unable to delete the task.');
      toast.error('Failed to delete task', 'Please try again.');
    } finally {
      setBusy(null);
    }
  };
  const done = async (id: string) => {
    setBusy(id);
    setActionError('');
    try {
      await d.markDone.execute(id);
      toast.success('Task completed', 'Great work! Task marked as done.');
      await reload();
    } catch {
      setActionError('Unable to mark the task as done.');
      toast.error('Failed to mark task as done', 'Please try again.');
    } finally {
      setBusy(null);
    }
  };
  return {
    tasks,
    page,
    totalPages,
    totalItems,
    refreshing,
    loading,
    error,
    actionError,
    busy,
    create,
    update,
    remove,
    done,
    reload,
    refresh,
    goToPage,
  };
};
