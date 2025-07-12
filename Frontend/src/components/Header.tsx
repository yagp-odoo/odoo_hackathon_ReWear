import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Menu, X, User, ShoppingBag, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    avatar?: string;
    points?: number;
  };
}

export const Header = ({ isAuthenticated = false, user }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary group-hover:text-primary-glow transition-colors" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all" />
            </div>
            <span className="text-2xl font-bold gradient-text">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/browse" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Browse
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link 
              to="/community" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Community
            </Link>
          </nav>

          {/* Desktop Auth/User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Points Display */}
                <div className="glass px-3 py-1 rounded-full">
                  <span className="text-accent font-semibold">{user.points || 0} pts</span>
                </div>
                
                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <Link to="/wishlist">
                    <Button variant="ghost" size="icon" className="hover-glow relative">
                      <Heart className="h-5 w-5" />
                      {getWishlistCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getWishlistCount()}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Link to="/cart">
                    <Button variant="ghost" size="icon" className="hover-glow relative">
                      <ShoppingBag className="h-5 w-5" />
                      {getCartCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getCartCount()}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="icon" className="hover-glow">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="h-8 w-8 rounded-full border-2 border-primary/50"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover-glow">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow">
                    Join ReWear
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
        )}>
          <nav className="flex flex-col space-y-3 pt-4 border-t border-glass-border/50">
            <Link 
              to="/browse" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Items
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/community" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            
            <div className="pt-3 border-t border-glass-border/50">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Points</span>
                    <span className="text-accent font-semibold">{user.points || 0}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </Button>
                    </Link>
                    <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Cart
                      </Button>
                    </Link>
                  </div>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                      Join ReWear
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};