import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Share2, ArrowLeft, MessageCircle, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ItemDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  // Mock item data - in real app, fetch based on ID
  const item = {
    id: id || '1',
    title: 'Vintage Denim Jacket',
    description: 'Beautiful vintage denim jacket from the 90s. Perfect condition with minimal wear. Features classic styling with button closure and chest pockets. Made from high-quality denim that gets better with age.',
    price: 45,
    originalPrice: 120,
    condition: 'Excellent',
    size: 'M',
    brand: 'Levi\'s',
    category: 'Outerwear',
    color: 'Indigo Blue',
    material: '100% Cotton Denim',
    measurements: {
      chest: '42"',
      length: '24"',
      sleeves: '25"'
    },
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'
    ],
    seller: {
      name: 'Sarah M.',
      avatar: '/placeholder.svg',
      rating: 4.8,
      reviews: 32,
      joinDate: 'Member since 2022'
    },
    likes: 24,
    views: 156,
    postedDate: '2 days ago',
    tags: ['vintage', 'denim', 'jacket', '90s', 'classic'],
    swapOptions: {
      directSwap: true,
      pointsRedemption: 450,
      cashOption: true
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from wishlist" : "Added to wishlist",
      description: isLiked ? "Item removed from your wishlist" : "Item added to your wishlist"
    });
  };

  const handleSwapRequest = () => {
    toast({
      title: "Swap Request Sent!",
      description: "Your swap request has been sent to the seller."
    });
  };

  const handlePointsRedemption = () => {
    toast({
      title: "Points Redemption",
      description: "Processing your points redemption request..."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link to="/browse" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <Card className="glass border-glass-border overflow-hidden">
                <div className="relative">
                  <img 
                    src={item.images[currentImageIndex]} 
                    alt={item.title}
                    className="w-full h-96 object-cover"
                  />
                  <button 
                    onClick={handleLike}
                    className={`absolute top-4 right-4 p-2 rounded-full glass ${
                      isLiked ? 'text-red-500' : 'text-white hover:text-red-500'
                    } transition-colors`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </Card>
              
              {/* Image Thumbnails */}
              <div className="flex space-x-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img src={image} alt={`${item.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{item.title}</h1>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Heart className="h-4 w-4 mr-1" />
                    {item.likes} likes
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {item.views} views
                  </div>
                  <span className="text-sm text-muted-foreground">{item.postedDate}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">#{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Price and Swap Options */}
              <Card className="glass border-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-primary">${item.price}</div>
                      <div className="text-sm text-muted-foreground line-through">Originally ${item.originalPrice}</div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% Off
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleSwapRequest}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow"
                    >
                      Request Swap
                    </Button>
                    <Button 
                      onClick={handlePointsRedemption}
                      variant="outline" 
                      className="w-full"
                    >
                      Redeem with {item.swapOptions.pointsRedemption} Points
                    </Button>
                    <Button variant="outline" className="w-full">
                      Buy Now - ${item.price}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Item Information */}
              <Card className="glass border-glass-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Item Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Condition:</span>
                      <span className="ml-2 text-foreground font-medium">{item.condition}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <span className="ml-2 text-foreground font-medium">{item.size}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Brand:</span>
                      <span className="ml-2 text-foreground font-medium">{item.brand}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Color:</span>
                      <span className="ml-2 text-foreground font-medium">{item.color}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="ml-2 text-foreground font-medium">{item.material}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-glass-border">
                    <h4 className="font-medium text-foreground mb-2">Measurements</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Chest:</span>
                        <span className="ml-2 text-foreground">{item.measurements.chest}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Length:</span>
                        <span className="ml-2 text-foreground">{item.measurements.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sleeves:</span>
                        <span className="ml-2 text-foreground">{item.measurements.sleeves}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="glass border-glass-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>

              {/* Seller Information */}
              <Card className="glass border-glass-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Seller Information</h3>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={item.seller.avatar} />
                      <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-foreground">{item.seller.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-foreground ml-1">{item.seller.rating}</span>
                          <span className="text-sm text-muted-foreground ml-1">({item.seller.reviews} reviews)</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.seller.joinDate}</p>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust & Safety */}
              <Card className="glass border-glass-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Trust & Safety</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-foreground">Verified seller with authentic items</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-foreground">Secure shipping with tracking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RotateCcw className="h-5 w-5 text-purple-500" />
                      <span className="text-sm text-foreground">30-day return policy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ItemDetail;