// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import type { RootState } from '../../store';
// import { logout } from '../../store/slices/authSlice';
import { FullLayout } from '../../layouts/AppLayout';
import { useTheme } from '../../hooks/useTheme';

export function HomePage() {
  // const { user } = useSelector((state: RootState) => state.auth);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  return (
    <FullLayout>
      <div className=" border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--background-alt)] rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-4">
            Welcome, {theme}!
          </h1>
          
          <p className="text-[var(--text-muted)] mb-6">
            This is your dashboard home page. You can start adding your content here.
          </p>
          
          
          <button
            type='button'
            onClick={toggleTheme}
            className="px-4 py-2 bg-[var(--error)] text-[var(--background)] border border-[var(--background)] rounded hover:bg-opacity-90 transition-colors cursor-pointer"
          >
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          </button>
        </div>
      </div>
    </FullLayout>
  );
}
