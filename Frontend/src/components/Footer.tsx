import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full glass border-t border-glass-border/50 py-8 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold gradient-text">ReWear</span>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-6 text-muted-foreground text-sm">
          <Link to="/browse" className="hover:text-primary transition-colors">Browse</Link>
          <Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
          <Link to="/community" className="hover:text-primary transition-colors">Community</Link>
          <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
        </nav>
        {/* Copyright & Social */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-3 mb-1">
            <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1.64a9.09 9.09 0 0 1-2.88 1.1A4.48 4.48 0 0 0 16.11 0c-2.5 0-4.5 2.01-4.5 4.5 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.67 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 0 1 .96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3A9.05 9.05 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71z"/></svg>
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a4 4 0 0 0-4 4v3H7v4h4v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
          <span className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ReWear. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
} 