import { ReactNode, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, FileText, History, Settings, Menu, X, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { preferences } = useStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/profile', icon: <User size={20} />, label: 'My Profile' },
    { to: '/builder', icon: <FileText size={20} />, label: 'Resume Builder' },
    { to: '/chat', icon: <MessageSquare size={20} />, label: 'Interview Coach' },
    { to: '/history', icon: <History size={20} />, label: 'History' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] font-sans text-[#141414] dark:text-[#EDEDED] transition-colors duration-200 overflow-hidden">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#141414] z-50 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold tracking-tight font-mono text-blue-600 dark:text-blue-400">skillDB</h1>
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative inset-y-0 left-0 z-40 border-r border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#141414] flex flex-col no-print transition-all duration-300 ease-in-out transform",
        isMobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
        isDesktopCollapsed ? "md:w-20" : "md:w-64"
      )}>
        <div className={cn(
          "p-6 border-b border-[#E5E5E5] dark:border-[#262626] hidden md:flex items-center",
          isDesktopCollapsed ? "justify-center px-4" : "justify-between"
        )}>
          {!isDesktopCollapsed && (
            <h1 className="text-xl font-bold tracking-tight font-mono text-blue-600 dark:text-blue-400 truncate">skillDB</h1>
          )}
          {isDesktopCollapsed && (
            <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold font-mono text-sm">sD</div>
          )}
        </div>
        
        {/* Toggle Collapse Button for Desktop */}
        <button 
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          className="hidden md:flex absolute -right-3.5 top-20 bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] w-7 h-7 rounded-full items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white shadow-sm z-50 transition-colors"
        >
          {isDesktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Mobile Spacer */}
        <div className="h-16 border-b border-[#E5E5E5] dark:border-[#262626] md:hidden" />

        <nav className="flex-1 p-3 md:p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer group",
                  isActive
                    ? "bg-[#141414] dark:bg-white text-white dark:text-black shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262626] hover:text-gray-900 dark:hover:text-white",
                  isDesktopCollapsed ? "md:justify-center" : "md:justify-start"
                )
              }
              title={isDesktopCollapsed ? item.label : undefined}
            >
              <span className={cn("flex-shrink-0", !isDesktopCollapsed && "mr-3")}>{item.icon}</span>
              <span className={cn(
                "whitespace-nowrap transition-all duration-300",
                isDesktopCollapsed ? "md:hidden" : "md:block"
              )}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className={cn(
          "p-4 border-t border-[#E5E5E5] dark:border-[#262626] text-xs text-gray-400 dark:text-gray-500 font-mono transition-all duration-300",
          isDesktopCollapsed ? "text-center px-2" : ""
        )}>
          {isDesktopCollapsed ? "v1.1" : "v1.1.0 (Local Vault)"}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative pb-8 md:pb-0 pt-16 md:pt-0">
        <div className="mx-auto w-full h-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
