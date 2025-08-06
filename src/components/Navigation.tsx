import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: t('nav.home') },
    { path: "/illustrazioni", label: t('nav.illustrations') },
    { path: "/portachiavi", label: t('nav.keychains') },
    { path: "/commissioni", label: t('nav.commissions') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary hover:text-primary-glow transition-colors"
          >
            <Palette className="h-6 w-6" />
            <span className="font-serif text-xl font-semibold">ArtStudio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  isActive(item.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary bg-secondary"
                      : "text-foreground hover:text-primary hover:bg-secondary"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;