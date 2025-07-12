import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Share2, 
  Star, 
  Eye, 
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Tag,
  Package
} from 'lucide-react';
import { apiService } from '@/services/api';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/contexts/AuthContext';

// Use the Product interface from the API service
import { Product } from '@/services/api';

export default function ItemDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getProductById(productId!);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      navigate('/login');
      return;
    }

    if (!product) return;

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

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images!.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/browse')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/browse')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl glass-elevated border-glass-border/50">
                <img
                  src={product.images?.[currentImageIndex] || '/placeholder.svg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border-glass-border/50"
                    >
                      ←
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border-glass-border/50"
                    >
                      →
                    </Button>
                  </>
                )}

                {/* Status Badge */}
                {product.status && (
                  <Badge 
                    variant={product.status === 'sold' ? 'destructive' : 'default'}
                    className="absolute top-4 left-4"
                  >
                    {product.status === 'sold' ? 'Sold' : product.status}
                  </Badge>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                    -{discount}%
                  </Badge>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary' 
                          : 'border-glass-border/50 hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Actions */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                  {product.brand && (
                    <p className="text-lg text-muted-foreground">{product.brand}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                                     <Button
                     onClick={handleWishlistToggle}
                     disabled={isWishlistLoading}
                     variant={isInWishlist(product.id) ? "default" : "outline"}
                     className={`flex items-center gap-2 ${
                       isInWishlist(product.id) 
                         ? 'bg-red-500 hover:bg-red-600' 
                         : 'glass border-glass-border/50'
                     }`}
                   >
                     <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                     {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                   </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="glass border-glass-border/50"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">
                    {product.price} pts
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.originalPrice} pts
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <Badge className="bg-green-500 text-white">
                    Save {discount}%
                  </Badge>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{product.condition}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Size {product.size}</span>
                </div>
                {product.color && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-current" style={{ color: product.color.toLowerCase() }}></div>
                    <span className="capitalize">{product.color}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="capitalize">{product.material}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="glass border-glass-border/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Measurements */}
              {product.measurements && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Measurements</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {product.measurements.chest && (
                      <div className="text-center p-3 glass rounded-lg border-glass-border/50">
                        <div className="text-sm text-muted-foreground">Chest</div>
                        <div className="font-semibold">{product.measurements.chest}</div>
                      </div>
                    )}
                    {product.measurements.length && (
                      <div className="text-center p-3 glass rounded-lg border-glass-border/50">
                        <div className="text-sm text-muted-foreground">Length</div>
                        <div className="font-semibold">{product.measurements.length}</div>
                      </div>
                    )}
                    {product.measurements.sleeves && (
                      <div className="text-center p-3 glass rounded-lg border-glass-border/50">
                        <div className="text-sm text-muted-foreground">Sleeves</div>
                        <div className="font-semibold">{product.measurements.sleeves}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Seller Info */}
              {product.seller && (
                <Card className="glass-elevated border-glass-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Seller Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <img
                        src={product.seller.avatar || '/placeholder.svg'}
                        alt={product.seller.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-glass-border/50"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.seller.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.seller.rating} ({product.seller.reviews} reviews)</span>
                        </div>
                        {product.seller.joinDate && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>Member since {new Date(product.seller.joinDate).getFullYear()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                {product.likes !== undefined && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{product.likes} likes</span>
                  </div>
                )}
                {product.views !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{product.views} views</span>
                  </div>
                )}
                {product.postedDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {new Date(product.postedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}