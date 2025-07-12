import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Star } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/services/api';

interface ItemCardProps {
  product: Product;
  onClick?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ product, onClick }) => {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist, error } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Show login prompt or redirect
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 glass-elevated border-glass-border/50"
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Wishlist Button */}
          <Button
            size="sm"
            variant="ghost"
            className={`absolute top-2 right-2 w-8 h-8 p-0 rounded-full transition-all ${
              isInWishlist(product.id) 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </Button>

          {/* Status Badge */}
          {product.status && (
            <Badge 
              variant={product.status === 'sold' ? 'destructive' : 'default'}
              className="absolute top-2 left-2"
            >
              {product.status === 'sold' ? 'Sold' : product.status}
            </Badge>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute bottom-2 left-2 bg-red-500 text-white">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title and Brand */}
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
              {product.title}
            </h3>
            {product.brand && (
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              {product.price} pts
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice} pts
              </span>
            )}
          </div>

          {/* Details Row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {product.condition && (
                <span className="capitalize">{product.condition}</span>
              )}
              {product.size && (
                <span>{product.size}</span>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-3">
              {product.likes !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{product.likes}</span>
                </div>
              )}
              {product.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{product.views}</span>
                </div>
              )}
            </div>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <div className="flex items-center gap-2 pt-2 border-t border-glass-border/30">
              <img
                src={product.seller.avatar || '/placeholder.svg'}
                alt={product.seller.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{product.seller.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {product.seller.rating} ({product.seller.reviews})
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};