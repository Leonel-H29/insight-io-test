import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Spinner } from './Spinner';
interface Props {
  initialTitle?: string;
  submitLabel: string;
  loading: boolean;
  onSubmit: (title: string) => Promise<void>;
  onCancel?: () => void;
}
export const TaskForm = ({
  initialTitle = '',
  submitLabel,
  loading,
  onSubmit,
  onCancel,
}: Props) => {
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = title.trim();
    if (!value) {
      setError('Title is required.');
      return;
    }
    if (value.length > 255) {
      setError('Title must be 255 characters or fewer.');
      return;
    }
    setError('');
    await onSubmit(value);
  };
  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => void submit(e)}
      className="d-flex gap-2"
    >
      <div className="flex-grow-1">
        <label className="visually-hidden">Task title</label>
        <input
          className={`form-control ${error ? 'is-invalid' : ''}`}
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="What needs to be done?"
          disabled={loading}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
      <button className="btn btn-primary" disabled={loading}>
        {loading ? <Spinner /> : submitLabel}
      </button>
      {onCancel && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </form>
  );
};
