import { useTheme } from "../hooks/useTheme";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

interface HeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isSidebarOpen: boolean) => void;
}

export function Header({ onMenuClick, isMobile, setIsSidebarOpen, isSidebarOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const handleMenuClick = () => {
    if (onMenuClick) onMenuClick();
    else setIsSidebarOpen?.(!isSidebarOpen);

  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 z-50 shadow-sm ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-[var(--text)] text-xl font-semibold">Logo</h1>
        </div>
        
        <div className="flex items-center gap-4">
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
