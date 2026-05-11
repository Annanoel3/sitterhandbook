import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PawPrint, FileText, Plus, Settings, BookOpen } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: PawPrint },
    { to: '/sheets', label: 'My Sheets', icon: FileText },
    { to: '/household', label: 'My Info', icon: BookOpen },
    { to: '/create', label: 'New Sheet', icon: Plus },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-semibold text-lg hidden sm:block">SitterHandbook</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}