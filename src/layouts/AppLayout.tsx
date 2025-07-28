import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface FullLayoutProps {
  children: React.ReactNode;
}

export function FullLayout({ children }: FullLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      {/* Fixed Header */}
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden py-16">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div 
            className={`
              fixed lg:sticky top-16 bottom-0 left-0 w-64 
              bg-[var(--background-alt)] z-10 
              transition-all duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              lg:block
            `}
          >
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          </div>
        )}
        
        
        {/* Main Content */}
        <div className={`border border-white
          flex-1 flex flex-col overflow-hidden 
          transition-all duration-300
        `}>
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="min-h-[calc(100vh-6rem)]">
              {children}
            </div>
          </main>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

interface SimpleLayoutProps {
  children: React.ReactNode;
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--text)]">
      <main className="w-full max-w-4xl p-4">
        {children}
      </main>
    </div>
  );
}
