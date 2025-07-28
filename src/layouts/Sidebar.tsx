import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { theme } = useTheme();
  return (
    <div className=''>
      {isOpen && (
        <aside className="h-full w-full overflow-y-auto ">
          <nav className={`p-4 fixed inset-y-0 left-0 w-64 ${theme === "dark" ? "bg-black" : "bg-white"} transition-transform duration-300 ease-in-out my-16`}>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? `bg-[var(--primary)] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`
                        : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                    }`
                  }
                  onClick={onClose}
                >
                  <span className="text-xl">🏠</span>
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? `bg-[var(--primary)] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`
                        : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                    }`
                  }
                  onClick={onClose}
                >
                  <span className="text-xl">📊</span>
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? `bg-[var(--primary)] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`
                        : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                    }`
                  }
                  onClick={onClose}
                >
                  <span className="text-xl">⚙️</span>
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
      )}
    </div>
  );
}
