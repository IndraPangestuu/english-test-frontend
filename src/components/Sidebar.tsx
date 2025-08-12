import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { routesConfig } from '@/routes/config';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { profile, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const role = profile?.role || 'student';

  const currentMenu =
    routesConfig
      .filter((route) => route.allowedRoles.includes(role))
      .map((route) => ({
        label: route.label,
        path: route.path,
        icon: route.icon,
      }));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 font-bold text-lg border-b border-gray-700 flex justify-between items-center">
        English Test
        {/* Close button for mobile */}
        {onClose && (
          <button
            className="lg:hidden p-1 rounded hover:bg-primary/20"
            onClick={onClose}
          >
            ✕
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        {currentMenu.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (onClose) onClose();
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-left transition-colors ${
                active ? 'bg-primary' : 'hover:bg-primary/70'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-3">
        <ThemeToggle />
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-primary/70 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
