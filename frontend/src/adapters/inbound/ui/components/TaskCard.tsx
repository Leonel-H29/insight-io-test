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
        <span
          className={`badge ${task.status === 'DONE' ? 'text-bg-success' : task.status === 'ARCHIVED' ? 'text-bg-secondary' : task.status === 'IN_PROGRESS' ? 'text-bg-primary' : 'text-bg-warning'}`}
        >
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {task.canStart && (
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={busy}
            onClick={() => void onStart()}
          >
            Start
          </button>
        )}
        {task.canDone && (
          <button
            className="btn btn-sm btn-success"
            disabled={busy}
            onClick={() => void onDone()}
          >
            {busy ? <Spinner /> : 'Mark as Done'}
          </button>
        )}
        {task.canArchive && (
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={busy}
            onClick={() => void onArchive()}
          >
            Archive
          </button>
        )}
        {task.canEdit && (
          <button
            className="btn btn-sm btn-outline-dark"
            disabled={busy}
            onClick={onEdit}
          >
            Edit
          </button>
        )}
        <button
          className="btn btn-sm btn-outline-danger"
          disabled={busy}
          onClick={() => void onDelete()}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
