import { Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import ThemeToggle from '@/components/ThemeToggle';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { profile, logout } = useAuthStore();

  return (
    <header className="w-full bg-secondary text-white border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: Hamburger menu (mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded hover:bg-primary/20"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg">English Test</span>
        </div>

        {/* Right: Theme toggle + user info */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="hidden sm:inline text-sm font-medium">
            {profile?.full_name || profile?.email || 'Guest'}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1 px-3 py-1 rounded-lg border border-transparent hover:border-primary hover:bg-primary/20 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
