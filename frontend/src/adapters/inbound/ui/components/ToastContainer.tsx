import {
  useToastContext,
  type Toast,
} from '../../../../app/providers/ToastContext';
import { Toast as ToastComponent } from './Toast';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div
      className="position-fixed p-3"
      style={{
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        maxWidth: '400px',
      }}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="d-flex flex-column gap-2">
        {toasts.map((toast: Toast) => (
          <ToastComponent key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};
