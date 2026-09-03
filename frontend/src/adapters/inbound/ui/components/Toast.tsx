import type {
  Toast as ToastNotification,
  ToastType,
} from '../../../../app/providers/ToastContext';

interface Props {
  toast: ToastNotification;
  onClose: (id: string) => void;
}

const getToastIcon = (type: ToastType): string => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '!';
    case 'info':
      return 'ℹ';
    default:
      return '◆';
  }
};

const getToastClass = (type: ToastType): string => {
  const baseClass = 'toast-body';
  switch (type) {
    case 'success':
      return (
        baseClass +
        ' bg-success-subtle text-success-emphasis border-start border-4 border-success'
      );
    case 'error':
      return (
        baseClass +
        ' bg-danger-subtle text-danger-emphasis border-start border-4 border-danger'
      );
    case 'warning':
      return (
        baseClass +
        ' bg-warning-subtle text-warning-emphasis border-start border-4 border-warning'
      );
    case 'info':
      return (
        baseClass +
        ' bg-info-subtle text-info-emphasis border-start border-4 border-info'
      );
    default:
      return baseClass;
  }
};

export const Toast = ({ toast, onClose }: Props) => {
  return (
    <div
      className="toast show"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-bs-autohide={toast.autoClose}
      data-bs-delay={toast.duration}
    >
      <div className={getToastClass(toast.type)}>
        <div className="d-flex align-items-start gap-2">
          <span className="flex-shrink-0 fw-bold fs-5" aria-hidden="true">
            {getToastIcon(toast.type)}
          </span>
          <div className="flex-grow-1">
            <div className="fw-semibold">{toast.title}</div>
            {toast.message && <div className="small mt-1">{toast.message}</div>}
          </div>
          <button
            type="button"
            className="btn-close btn-close-sm"
            onClick={() => onClose(toast.id)}
            aria-label="Dismiss notification"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
      </div>
    </div>
  );
};
