import { useState, useRef, useEffect } from 'react';
import { useTheme } from "../hooks/useTheme";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import Logo from '../assets/logo.svg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface HeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isSidebarOpen: boolean) => void;
}

export function Header({ onMenuClick, isMobile, setIsSidebarOpen, isSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = () => {
    if (onMenuClick) onMenuClick();
    else setIsSidebarOpen?.(!isSidebarOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 z-50 shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          {isMobile ? (
            <h1 className="text-[var(--text)] text-xl font-semibold">Logo</h1>
          ) : (
            <div className="h-8 flex items-center">
              <img 
                src={Logo} 
                alt="logo" 
                className={`h-full w-auto ml-1 filter transition-all duration-300 ${theme === 'dark' ? 'brightness-0 invert' : 'brightness-0'}`}
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              title="User menu"
              type="button"
              onClick={toggleDropdown}
              className="flex items-center justify-center bg-[var(--primary)] text-[var(--text)] font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity rounded-full p-1"
              aria-haspopup="menu"
              // aria-expanded={isDropdownOpen}
              aria-label="User menu"
            >
              <AccountCircleIcon fontSize="large" />
              <ArrowDropDownIcon />
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-56 rounded-md shadow-lg bg-[var(--background)] ring-1 ring-black ring-opacity-5 focus:outline-none z-60">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div className="px-4 py-3 border-b border-[var(--border)]">
                    <p className="text-sm text-[var(--text)]">Signed in as</p>
                    <p className="text-sm font-medium text-[var(--text)] truncate">user@example.com</p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--background-alt)]"
                    role="menuitem"
                  >
                    <PersonIcon className="mr-3 h-5 w-5 text-[var(--text-muted)]" />
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--background-alt)]"
                    role="menuitem"
                  >
                    <SettingsIcon className="mr-3 h-5 w-5 text-[var(--text-muted)]" />
                    Settings
                  </a>
                  <div className="border-t border-[var(--border)] my-1"></div>
                  <button
                    type="button"
                    onClick={() => {
                      // Add your sign out logic here
                      console.log('Sign out clicked');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-[var(--background-alt)]"
                    role="menuitem"
                  >
                    <LogoutIcon className="mr-3 h-5 w-5" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isMobile && !isSidebarOpen && (
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <button 
              type="button"
              onClick={handleMenuClick}
              className="p-1 rounded-md text-[var(--text)] hover:bg-[var(--background)] focus:outline-none"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          )}
          
        </div>
      </div>
    </header>
  );
}
