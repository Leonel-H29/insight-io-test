import type { TaskViewModel } from '../view-models/TaskViewModel';
import { Spinner } from './Spinner';
interface Props {
  task: TaskViewModel;
  busy: boolean;
  onStart: () => Promise<void>;
  onDone: () => Promise<void>;
  onArchive: () => Promise<void>;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}
export const TaskCard = ({
  task,
  busy,
  onStart,
  onDone,
  onArchive,
  onEdit,
  onDelete,
}: Props) => (
  <div className="card shadow-sm mb-3">
    <div className="card-body d-flex flex-column flex-md-row gap-3 align-items-md-center">
      <div className="flex-grow-1">
        <h2 className="h5 mb-2">{task.title}</h2>
        <div className="small text-body-secondary mb-2">
          {task.ownerUsername} -{' '}
          {new Date(task.updatedAt).toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </div>
        <span
          className={`badge ${task.status === 'DONE' ? 'text-bg-success' : task.status === 'ARCHIVED' ? 'text-bg-secondary' : task.status === 'IN_PROGRESS' ? 'text-bg-primary' : 'text-bg-warning'}`}
        >
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {task.canStart && (
          <button
            type="button"
            className="btn btn-sm btn-primary"
            disabled={busy}
            onClick={() => void onStart()}
            aria-label={`Start task: ${task.title}`}
          >
            Start
          </button>
        )}
        {task.canDone && (
          <button
            type="button"
            className="btn btn-sm btn-success"
            disabled={busy}
            onClick={() => void onDone()}
            aria-label={`Mark as done: ${task.title}`}
          >
            {busy ? <Spinner /> : 'Mark as Done'}
          </button>
        )}
        {task.canArchive && (
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            disabled={busy}
            onClick={() => void onArchive()}
            aria-label={`Archive task: ${task.title}`}
          >
            Archive
          </button>
        )}
        {task.canEdit && (
          <button
            type="button"
            className="btn btn-sm btn-warning"
            disabled={busy}
            onClick={onEdit}
            aria-label={`Edit task: ${task.title}`}
          >
            Edit
          </button>
        )}
        <button
          type="button"
          className="btn btn-sm btn-danger"
          disabled={busy}
          onClick={() => void onDelete()}
          aria-label={`Delete task: ${task.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
