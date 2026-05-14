import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PawPrint, FileText, Plus, Settings, BookOpen, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: PawPrint },
    { to: '/sheets', label: 'My Sheets', icon: FileText },
    { to: '/household', label: 'My Info', icon: BookOpen },
    { to: '/create', label: 'New Sheet', icon: Plus },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  // Mark "/" active only on exact match so other routes don't highlight it
  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-semibold text-lg">SitterHandbook</span>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile/Tablet Hamburger Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px] flex flex-col pt-12">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <PawPrint className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-semibold text-lg">SitterHandbook</span>
              </Link>
              <nav className="flex flex-col gap-2">
                {links.map(link => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive(link.to)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}