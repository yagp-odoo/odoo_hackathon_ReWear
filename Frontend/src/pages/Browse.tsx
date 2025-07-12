import { useState, useEffect } from 'react';
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
import { apiService, Product } from '@/services/api';

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('Newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'Dresses', 'Jackets', 'Sweaters', 'Blazers', 'Pants', 'Shoes', 'Accessories', 'Tops', 'Bottoms', 'Outerwear', 'Formal Wear'];
const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const conditions = ['All', 'Like New', 'Excellent', 'Good', 'Fair', 'Vintage'];
const brands = ['All', 'Levi\'s', 'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Everlane', 'Patagonia', 'Vintage', 'Designer'];
const colors = ['All', 'Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray', 'Multi'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular', 'Most Liked', 'Recently Added'];
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Check if we have multiple filters that can be handled by advanced search
        const hasMultipleFilters = (
          selectedSize !== 'All' || 
          selectedCondition !== 'All' || 
          selectedBrand !== 'All' || 
          selectedColor !== 'All'
        );

        // Use advanced search if we have multiple filters, otherwise use basic search
        let fetched;
        if (hasMultipleFilters) {
          const searchParams: any = {};
          
          if (searchQuery) {
            searchParams.title = searchQuery;
          }
          
          if (selectedCategory !== 'All') {
            searchParams.category = selectedCategory;
          }
          
          if (selectedSize !== 'All') {
            searchParams.size = selectedSize;
          }
          
          if (selectedCondition !== 'All') {
            searchParams.condition = selectedCondition;
          }
          
          if (selectedBrand !== 'All') {
            searchParams.brand = selectedBrand;
          }
          
          if (selectedColor !== 'All') {
            searchParams.color = selectedColor;
          }
          
          if (priceRange[0] > 0 || priceRange[1] < 500) {
            if (priceRange[0] > 0) searchParams.min_price = priceRange[0];
            if (priceRange[1] < 500) searchParams.max_price = priceRange[1];
          }

          fetched = await apiService.advancedSearchProducts(searchParams);
        } else {
          // Build basic search parameters
          const searchParams: any = {};
          
          if (searchQuery) {
            searchParams.title = searchQuery;
          }
          
          if (selectedCategory !== 'All') {
            searchParams.category = selectedCategory;
          }
          
          if (priceRange[0] > 0 || priceRange[1] < 500) {
            if (priceRange[0] > 0) searchParams.min_price = priceRange[0];
            if (priceRange[1] < 500) searchParams.max_price = priceRange[1];
          }

          // Use search API if any filters are applied, otherwise get all products
          if (Object.keys(searchParams).length > 0) {
            fetched = await apiService.searchProducts(searchParams);
          } else {
            fetched = await apiService.getAllProducts();
          }
        }

        // Apply client-side sorting
        let sortedProducts = [...fetched];

        // Apply sorting
        switch (sortBy) {
          case 'Price: Low to High':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case 'Price: High to Low':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case 'Most Popular':
            sortedProducts.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;
          case 'Most Liked':
            sortedProducts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            break;
          case 'Newest':
          case 'Recently Added':
            sortedProducts.sort((a, b) => {
              const dateA = a.postedDate ? new Date(a.postedDate).getTime() : 0;
              const dateB = b.postedDate ? new Date(b.postedDate).getTime() : 0;
              return dateB - dateA;
            });
            break;
          default:
            // Keep original order
            break;
        }

        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Add debouncing for search query
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, selectedSize, selectedCondition, selectedBrand, selectedColor, priceRange, sortBy]);

  const activeFilters = [
    selectedCategory !== 'All' && selectedCategory,
    selectedSize !== 'All' && `Size ${selectedSize}`,
    selectedCondition !== 'All' && selectedCondition,
    selectedBrand !== 'All' && selectedBrand,
    selectedColor !== 'All' && selectedColor,
    priceRange[1] < 500 && `Under $${priceRange[1]}`,
  ].filter(Boolean);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedCondition('All');
    setSelectedBrand('All');
    setSelectedColor('All');
    setPriceRange([0, 500]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
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

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-glass-border/50 slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="glass border-glass-border/50">
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent className="glass border-glass-border">
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="glass border-glass-border/50">
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent className="glass border-glass-border">
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Price Range</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="glass border-glass-border/50"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        className="glass border-glass-border/50"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500])}
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="w-full glass border-glass-border/50 hover-glow"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}

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
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Searching...</p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Showing <span className="text-foreground font-semibold">{products.length}</span> items
                {searchQuery && (
                  <span> for "<span className="text-primary">{searchQuery}</span>"</span>
                )}
              </p>
            )}
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-sm">
                  {searchQuery || activeFilters.length > 0 
                    ? "Try adjusting your search terms or filters"
                    : "No products available at the moment"
                  }
                </p>
              </div>
              {(searchQuery || activeFilters.length > 0) && (
                <Button onClick={clearAllFilters} variant="outline">
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((item) => (
                <ItemCard
                  key={item.id}
                  product={item}
                  onClick={() => window.location.href = `/item/${item.id}`}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {/* <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="glass border-glass-border/50 hover-glow px-8"
            >
              Load More Items
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
}