import { useState } from 'react';
import { Header } from '@/components/Header';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Trash2, ShoppingBag, Filter } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/services/api';

export default function Wishlist() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlist, isLoading, error, removeFromWishlist, clearError } = useWishlist();
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-6">Please log in to view your wishlist.</p>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const filteredWishlist = wishlist.filter(item => {
    if (filter === 'available') return item.product.status !== 'sold';
    if (filter === 'sold') return item.product.status === 'sold';
    return true;
  });

  const availableItems = wishlist.filter(item => item.product.status !== 'sold');
  const soldItems = wishlist.filter(item => item.product.status === 'sold');

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const handleItemClick = (product: Product) => {
    navigate(`/item/${product.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">My</span> Wishlist
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your saved items and fashion favorites. Keep track of what you love.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-elevated border-glass-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{wishlist.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-elevated border-glass-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold text-green-600">{availableItems.length}</p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-elevated border-glass-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sold</p>
                    <p className="text-2xl font-bold text-gray-600">{soldItems.length}</p>
                  </div>
                  <Trash2 className="h-8 w-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-muted/20 rounded-lg p-1 glass border-glass-border/50">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
                className="rounded-md"
              >
                All ({wishlist.length})
              </Button>
              <Button
                variant={filter === 'available' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('available')}
                className="rounded-md"
              >
                Available ({availableItems.length})
              </Button>
              <Button
                variant={filter === 'sold' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('sold')}
                className="rounded-md"
              >
                Sold ({soldItems.length})
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="glass-elevated border-red-500/50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-red-600">{error}</p>
                  <Button variant="ghost" size="sm" onClick={clearError}>
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wishlist Items */}
          {filteredWishlist.length === 0 ? (
            <Card className="glass-elevated border-glass-border/50">
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {filter === 'all' ? 'Your wishlist is empty' : `No ${filter} items`}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {filter === 'all' 
                    ? 'Start adding items you love to your wishlist!' 
                    : `You don't have any ${filter} items in your wishlist.`
                  }
                </p>
                {filter === 'all' && (
                  <Button onClick={() => navigate('/browse')}>
                    Browse Items
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWishlist.map((item) => (
                <div key={item.id} className="relative group">
                  <ItemCard 
                    product={item.product} 
                    onClick={() => handleItemClick(item.product)}
                  />
                  
                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 left-2 w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(item.product_id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* Added Date Badge */}
                  <Badge className="absolute bottom-2 right-2 bg-primary/90 text-primary-foreground text-xs">
                    {new Date(item.added_at).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}