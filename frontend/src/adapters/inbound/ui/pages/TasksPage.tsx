import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { toTaskViewModel } from '../view-models/TaskViewModel';
import { Spinner } from '../components/Spinner';
import { TaskStatus } from '../../../../domain/task/entities/TaskStatus';
import type { TaskResult } from '../../../../application/task/dto/TaskResult';
export const TasksPage = () => {
  const { logout } = useAuth();
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
  } = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();
  return (
    <main className="min-vh-100 bg-body-tertiary">
      <nav className="navbar bg-white border-bottom">
        <div className="container">
          <span className="navbar-brand fw-semibold">Task Management</span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </button>
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
              tasks.map((task: TaskResult) => {
                const vm = toTaskViewModel(task);
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
                      update({ id: task.id, status: TaskStatus.IN_PROGRESS })
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
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
