import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen = false, onClose, isMobile = false, setIsOpen }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const [view, setView] = useState(true);
  
  // Determine the width class based on isOpen and device type
  const getWidthClass = () => {
    if (!isOpen) return 'w-16';
    return isMobile ? 'w-48' : 'w-64';
  };
  
  // Determine if we should show text (always show on desktop, only when open on mobile)
  const shouldShowText = !isMobile || isOpen;

  useEffect(() => {
    if (isOpen && !isMobile) {
      setView(true);
    } else if (isMobile && !isOpen) {
      setView(false);
    } else {
      setView(true)
    }
  },[isOpen,isMobile]);

  return (
    <div className='' onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      {view && (
        <aside className="overflow-y-auto h-full">
          <nav 
            className={`p-2 fixed inset-y-0 left-0 ${getWidthClass()} ${
              theme === "dark" ? "bg-black" : "bg-white"
            } transition-all duration-300 ease-in-out my-16 z-40 flex flex-col justify-between`}
            style={{
              // Add some shadow when open on mobile
              boxShadow: isOpen && isMobile ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-3 transition-colors ${
                      isActive 
                        ? `border-l-2 rounded-l-lg bg-[var(--primary)] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`
                        : `rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                    }`
                  }
                  onClick={onClose}
                >
                  <HomeIcon />
                  {shouldShowText && <span className="truncate">Home</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-3 transition-colors ${
                      isActive 
                        ? `border-l-2 rounded-l-lg bg-[var(--primary)] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`
                        : `rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                    }`
                  }
                  onClick={onClose}
                >
                  <DashboardIcon />
                  {shouldShowText && <span className="truncate">Dashboard</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-3 transition-colors ${
                      isActive 
                        ? `border-l-2 rounded-l-lg bg-[var(--primary)] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`
                        : `rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                    }`
                  }
                  onClick={onClose}
                >
                  <SettingsIcon />
                  {shouldShowText && <span className="truncate">Settings</span>}
                </NavLink>
              </li>
            </ul>
            {isMobile && (
              <ul>
                <li className='p-3 transition-colors'>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex justify-start p-2 w-full rounded-lg bg-[var(--primary)] text-[var(--text)] hover:bg-[var(--primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  >
                    {theme === 'dark' ? '🌞' : '🌙'}
                    {shouldShowText && <span className="truncate px-2">{theme === 'dark' ? 'Dark' : 'Night'}</span>}
                  </button>
                </li>
              </ul>
            )}

          </nav>
        </aside>
      )}
    </div>
  );
}
