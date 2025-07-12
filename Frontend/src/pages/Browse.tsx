import { useState } from 'react';
import { Header } from '@/components/Header';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X
} from 'lucide-react';

// Mock data
const mockItems = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic 90s oversized denim jacket with unique distressing. Perfect for layering and adding edge to any outfit.',
    images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'],
    category: 'Jackets',
    size: 'M',
    condition: 'Excellent',
    points: 150,
    owner: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b547?w=100',
      rating: 4.8
    }
  },
  {
    id: '2',
    title: 'Designer Midi Dress',
    description: 'Elegant floral midi dress from a luxury brand. Worn only once to a wedding. Perfect for special occasions.',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'],
    category: 'Dresses',
    size: 'S',
    condition: 'Excellent',
    points: 300,
    owner: {
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 4.9
    }
  },
  {
    id: '3',
    title: 'Cozy Knit Sweater',
    description: 'Soft merino wool sweater in cream color. Minimal wear, incredibly comfortable for fall and winter.',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400'],
    category: 'Sweaters',
    size: 'L',
    condition: 'Good',
    points: 120,
    owner: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 4.7
    }
  },
  {
    id: '4',
    title: 'Statement Blazer',
    description: 'Bold geometric print blazer that turns heads. Professional yet fun, perfect for creative workplaces.',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'],
    category: 'Blazers',
    size: 'M',
    condition: 'Good',
    points: 200,
    owner: {
      name: 'Maya Patel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      rating: 4.6
    }
  }
];

const categories = ['All', 'Dresses', 'Jackets', 'Sweaters', 'Blazers', 'Pants', 'Shoes', 'Accessories'];
const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
const conditions = ['All', 'Excellent', 'Good', 'Fair'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = [
    selectedCategory !== 'All' && selectedCategory,
    selectedSize !== 'All' && `Size ${selectedSize}`,
    selectedCondition !== 'All' && selectedCondition,
  ].filter(Boolean);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedCondition('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen">
      <Header isAuthenticated={true} user={{ name: 'You', points: 250 }} />
      
      {/* Page Header */}
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Discover</span> Your Next Favorite
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse thousands of unique, pre-loved fashion pieces waiting for their next adventure
            </p>
          </div>

          {/* Search and Filters */}
          <div className="glass-elevated rounded-2xl p-6 mb-8">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for items, brands, or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-lg glass border-glass-border/50"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 glass border-glass-border/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-32 glass border-glass-border/50">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger className="w-36 glass border-glass-border/50">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="glass border-glass-border/50 hover-glow"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 glass border-glass-border/50">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="glass border-glass-border">
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border border-glass-border/50 rounded-lg glass">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-glass-border/50">
                <span className="text-sm text-muted-foreground">Filters:</span>
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="glass">
                    {filter}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-primary"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{mockItems.length}</span> items
              {searchQuery && (
                <span> for "<span className="text-primary">{searchQuery}</span>"</span>
              )}
            </p>
          </div>

          {/* Items Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {mockItems.map((item) => (
              <ItemCard
                key={item.id}
                {...item}
                className={viewMode === 'list' ? 'max-w-none' : ''}
              />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="glass border-glass-border/50 hover-glow px-8"
            >
              Load More Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}