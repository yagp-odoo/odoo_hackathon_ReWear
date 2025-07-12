import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  size: string;
  condition: string;
  points?: number;
  owner: {
    name: string;
    avatar?: string;
    rating: number;
  };
  isLiked?: boolean;
  className?: string;
}

export const ItemCard = ({ 
  id, 
  title, 
  description, 
  images, 
  category, 
  size, 
  condition, 
  points, 
  owner, 
  isLiked = false,
  className = ''
}: ItemCardProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'fair': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Link to={`/item/${id}`} className={`block group ${className}`}>
      <div className="glass-elevated rounded-2xl overflow-hidden hover-lift transition-all duration-300 group-hover:scale-[1.02]">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          {images.length > 0 ? (
            <>
              <img 
                src={images[currentImageIndex]} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {images.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute inset-0 w-full h-full bg-transparent hover:bg-black/10 transition-colors"
                  aria-label="Next image"
                />
              )}
              {/* Image Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40">
              <div className="text-muted-foreground text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted/50 flex items-center justify-center">
                  <span className="text-2xl">👕</span>
                </div>
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full glass border border-glass-border/50 flex items-center justify-center transition-all hover:scale-110 ${
              liked ? 'text-red-400 hover:text-red-300' : 'text-white/70 hover:text-white'
            }`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
          </button>

          {/* Points Badge */}
          {points && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-accent/90 text-accent-foreground border-accent/50 font-semibold">
                {points} pts
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title & Category */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Size {size}
            </Badge>
            <Badge className={`text-xs border ${getConditionColor(condition)}`}>
              {condition}
            </Badge>
          </div>

          {/* Owner Info */}
          <div className="flex items-center justify-between pt-2 border-t border-glass-border/50">
            <div className="flex items-center space-x-2">
              {owner.avatar ? (
                <img 
                  src={owner.avatar} 
                  alt={owner.name}
                  className="w-6 h-6 rounded-full border border-glass-border/50"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
              )}
              <span className="text-xs text-muted-foreground">{owner.name}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-muted-foreground">{owner.rating}</span>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
};