import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { routesConfig } from '../routes/config';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  // Filter routes based on user role
  const allowedRoutes = routesConfig.filter(route => 
    route.allowedRoles.includes(profile?.role || '')
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {allowedRoutes.map((route) => {
            const Icon = route.icon;
            const isActive = location.pathname === route.path;
            
            return (
              <li key={route.path}>
                <button
                  onClick={() => handleNavigation(route.path)}
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{route.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          Logged in as {profile?.role}
        </div>
      </div>
    </div>
  );
}