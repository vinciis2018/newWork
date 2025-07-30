import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useDeviceType } from '../hooks/useDevice';

interface FullLayoutProps {
  children: React.ReactNode;
}

export function FullLayout({ children }: FullLayoutProps) {
  const { isMobile } = useDeviceType();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col">
      {/* Fixed Header */}
      <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isMobile={isMobile} />
      
      <div className="flex flex-1 overflow-hidden py-8">
        {/* Sidebar - Fixed on mobile, sticky on desktop */}
        <div 
          className={`
            fixed lg:sticky top-16 bottom-0 left-0 h-[calc(100vh-4rem)]
            bg-[var(--background-alt)] z-10
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform duration-300 ease-in-out
            w-16 flex-shrink-0
          `}
        >
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} isMobile={isMobile} setIsOpen={setIsSidebarOpen} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="min-h-[calc(100vh-10rem)] mr-16">
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
  const { isMobile } = useDeviceType();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      {/* Fixed Header */}
      <Header onMenuClick={() => {}} isSidebarOpen={false} setIsSidebarOpen={() => {}} isMobile={isMobile} />
      
      <div className="flex flex-1 overflow-hidden py-12">
        {/* Main Content */}
        <div className={`
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

interface NoLayoutProps {
  children: React.ReactNode;
}

export function NoLayout({ children }: NoLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--text)]">
      <main className="w-full max-w-4xl p-4">
        {children}
      </main>
    </div>
  );
}

