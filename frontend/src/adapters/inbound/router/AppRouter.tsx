import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../ui/pages/LoginPage';
import { TasksPage } from '../ui/pages/TasksPage';
import { useAuth } from '../ui/hooks/useAuth';
export const AppRouter = () => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <span className="spinner-border" role="status" />
      </div>
    );
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/tasks" replace /> : <LoginPage />}
      />
      <Route
        path="/tasks"
        element={user ? <TasksPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? '/tasks' : '/login'} replace />}
      />
    </Routes>
  );
};
