import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import { SimpleLayout } from '../../layouts/AppLayout';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    dispatch(login({ username: 'demo_user' }));
    navigate('/');
  };

  return (
    <SimpleLayout>
      <div className="w-full max-w-md mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center text-[var(--text)]">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--text-muted)] bg-[var(--background)] placeholder-[var(--text-muted)] text-[var(--text)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-[var(--text-muted)] bg-[var(--background)] placeholder-[var(--text-muted)] text-[var(--text)] focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            Sign in
          </button>
        </form>
      </div>
    </SimpleLayout>
  );
}
