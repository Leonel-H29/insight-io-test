import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/Spinner';
export const LoginPage = () => {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const submit = async () => {
    try {
      await login();
      navigate('/tasks');
    } catch {}
  };
  return (
    <main className="min-vh-100 d-flex align-items-center bg-body-tertiary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h1 className="h3 mb-1">Task Management</h1>
                <p className="text-secondary mb-4">
                  Sign in to manage your tasks.
                </p>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <button
                  className="btn btn-primary w-100"
                  onClick={() => void submit()}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : 'Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
