import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { UserInfo } from '../components/UserInfo';
import { ThemeToggle } from '../components/ThemeToggle';
import { toTaskViewModel } from '../view-models/TaskViewModel';
import { Spinner } from '../components/Spinner';
import { TaskStatus } from '../../../../domain/task/entities/TaskStatus';
import type { TaskResult } from '../../../../application/task/dto/TaskResult';
export const TasksPage = () => {
  const { logout, user } = useAuth();
  const {
    tasks,
    loading,
    error,
    actionError,
    busy,
    create,
    update,
    remove,
    done,
    refresh,
    refreshing,
    page,
    totalPages,
    totalItems,
    goToPage,
  } = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();
  return (
    <main className="min-vh-100 bg-body">
      <nav className="navbar bg-body border-bottom">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-semibold mb-0">Task Management</span>
          <div className="d-flex align-items-center gap-2">
            <ThemeToggle />
            {user && <UserInfo user={user} />}
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-9">
            <section className="card shadow-sm mb-4">
              <div className="card-body">
                <h1 className="h4 mb-3">Create a task</h1>
                <TaskForm
                  submitLabel="Add task"
                  loading={busy === 'create'}
                  onSubmit={create}
                />
              </div>
            </section>
            {actionError && (
              <div className="alert alert-warning" role="alert">
                {actionError}
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h1 className="h4 mb-1">Tasks</h1>
                <span className="text-secondary small">
                  {totalItems} total task{totalItems === 1 ? '' : 's'}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => void refresh()}
                disabled={refreshing || loading}
                aria-label="Refresh tasks"
              >
                {refreshing ? <Spinner /> : 'Refresh'}
              </button>
            </div>
            {loading ? (
              <div className="text-center py-5">
                <Spinner /> <span className="ms-2">Loading tasks...</span>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-5">
                <h2 className="h5">No tasks yet</h2>
                <p className="text-secondary">Create your first task above.</p>
              </div>
            ) : (
              <>
                <div
                  className="pe-2"
                  style={{ maxHeight: '60vh', overflowY: 'auto' }}
                  aria-label="Task list"
                >
                  {tasks.map((task: TaskResult) => {
                    const ownerUsername =
                      task.ownerId === user?.id
                        ? user?.username ||
                          user?.name ||
                          user?.email ||
                          task.ownerId
                        : task.ownerId;
                    const vm = toTaskViewModel(
                      task,
                      user?.id ?? '',
                      ownerUsername
                    );
                    return editingId === task.id ? (
                      <div className="card shadow-sm mb-3" key={task.id}>
                        <div className="card-body">
                          <h2 className="h6">Edit task</h2>
                          <TaskForm
                            initialTitle={task.title}
                            submitLabel="Save"
                            loading={busy === task.id}
                            onCancel={() => setEditingId(null)}
                            onSubmit={async (title) => {
                              await update({ id: task.id, title });
                              setEditingId(null);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <TaskCard
                        key={task.id}
                        task={vm}
                        busy={busy === task.id}
                        onStart={() =>
                          update({
                            id: task.id,
                            status: TaskStatus.IN_PROGRESS,
                          })
                        }
                        onDone={() => done(task.id)}
                        onArchive={() =>
                          update({ id: task.id, status: TaskStatus.ARCHIVED })
                        }
                        onEdit={() => setEditingId(task.id)}
                        onDelete={async () => {
                          if (window.confirm('Delete this task?'))
                            await remove(task.id);
                        }}
                      />
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <nav
                    className="d-flex justify-content-center align-items-center gap-3 mt-3"
                    aria-label="Task pages"
                  >
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1 || refreshing}
                    >
                      Previous
                    </button>
                    <span className="small text-secondary">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages || refreshing}
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
