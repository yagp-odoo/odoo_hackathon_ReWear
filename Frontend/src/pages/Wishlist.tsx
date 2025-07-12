import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ItemCard } from '@/components/ItemCard';
import { Heart, Filter, Grid, List, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      price: 45,
      originalPrice: 120,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      condition: 'Excellent',
      size: 'M',
      brand: 'Levi\'s',
      seller: 'Sarah M.',
      likes: 24,
      isLiked: true,
      addedDate: '2024-03-10',
      available: true
    },
    {
      id: 2,
      title: 'Designer Silk Scarf',
      price: 35,
      originalPrice: 80,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
      condition: 'Like New',
      size: 'One Size',
      brand: 'Hermès',
      seller: 'Emma W.',
      likes: 18,
      isLiked: true,
      addedDate: '2024-03-08',
      available: true
    },
    {
      id: 3,
      title: 'Leather Ankle Boots',
      price: 65,
      originalPrice: 150,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d2f?w=400',
      condition: 'Good',
      size: '8',
      brand: 'Cole Haan',
      seller: 'Alex C.',
      likes: 32,
      isLiked: true,
      addedDate: '2024-03-05',
      available: false
    },
    {
      id: 4,
      title: 'Cashmere Sweater',
      price: 55,
      originalPrice: 140,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
      condition: 'Excellent',
      size: 'S',
      brand: 'Everlane',
      seller: 'Maya P.',
      likes: 41,
      isLiked: true,
      addedDate: '2024-03-02',
      available: true
    }
  ]);

  const removeFromWishlist = (itemId: number) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your wishlist."
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist."
    });
  };

  const availableItems = wishlistItems.filter(item => item.available);
  const unavailableItems = wishlistItems.filter(item => !item.available);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 glass rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              {wishlistItems.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearWishlist}
                  className="text-red-400 border-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            /* Empty State */
            <Card className="glass border-glass-border">
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start browsing and save items you love to your wishlist.
                </p>
                <Link to="/browse">
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    Browse Items
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Available Items */}
              {availableItems.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Available</h2>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {availableItems.length}
                    </Badge>
                  </div>
                  
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }>
                    {availableItems.map((item) => (
                      <div key={item.id} className="relative group">
                        <ItemCard 
                          id={item.id.toString()}
                          title={item.title}
                          description={`${item.brand} ${item.condition} condition`}
                          images={[item.image]}
                          category={item.brand}
                          size={item.size}
                          condition={item.condition}
                          owner={{ name: item.seller, rating: 4.8 }}
                          isLiked={item.isLiked}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unavailable Items */}
              {unavailableItems.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h2 className="text-xl font-semibold text-foreground">No Longer Available</h2>
                    <Badge variant="secondary">
                      {unavailableItems.length}
                    </Badge>
                  </div>
                  
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }>
                    {unavailableItems.map((item) => (
                      <div key={item.id} className="relative group opacity-50">
                        <ItemCard 
                          id={item.id.toString()}
                          title={item.title}
                          description={`${item.brand} ${item.condition} condition`}
                          images={[item.image]}
                          category={item.brand}
                          size={item.size}
                          condition={item.condition}
                          owner={{ name: item.seller, rating: 4.8 }}
                          isLiked={item.isLiked}
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-white font-medium mb-2">No Longer Available</p>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => removeFromWishlist(item.id)}
                            >
                              Remove from Wishlist
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Items Suggestion */}
              {wishlistItems.length > 0 && (
                <Card className="glass border-glass-border">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Find Similar Items</h3>
                    <p className="text-muted-foreground mb-4">
                      Discover more items similar to your wishlist favorites.
                    </p>
                    <Link to="/browse">
                      <Button variant="outline">
                        Browse Similar Items
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;