import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Upload, 
  X, 
  Plus, 
  Camera, 
  Star,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { apiService } from '@/services/api';

const categories = [
  'Dresses', 'Tops', 'Bottoms', 'Jackets', 'Sweaters', 'Shoes', 
  'Accessories', 'Bags', 'Jewelry', 'Other'
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const conditions = ['Excellent', 'Good', 'Fair'];

const brands = [
  'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Levi\'s', 'Gap', 'Forever 21',
  'Urban Outfitters', 'American Eagle', 'Hollister', 'Aeropostale', 'Vans',
  'Converse', 'Puma', 'Under Armour', 'The North Face', 'Patagonia',
  'Columbia', 'Tommy Hilfiger', 'Calvin Klein', 'Ralph Lauren', 'Other'
];

const colors = [
  'Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple',
  'Brown', 'Gray', 'Orange', 'Navy', 'Burgundy', 'Olive', 'Beige', 'Cream',
  'Gold', 'Silver', 'Multi', 'Other'
];

const materials = [
  'Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Denim', 'Leather',
  'Suede', 'Velvet', 'Satin', 'Chiffon', 'Lace', 'Mesh', 'Fleece',
  'Spandex', 'Rayon', 'Acrylic', 'Nylon', 'Other'
];

const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL;

async function uploadImages(files: FileList): Promise<string[]> {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append('file', file));
  const res = await fetch(`${IMAGE_API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.map((img: { url: string }) => img.url);
}

export default function ListItem() {
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    points: 100,
    price: 0,
    originalPrice: 0,
    brand: '',
    brandOther: '',
    color: '',
    colorOther: '',
    material: '',
    materialOther: '',
    measurements: { chest: '', length: '', sleeves: '' },
    tags: '',
    likes: 0,
    views: 0,
    postedDate: '',
    pointsRedemption: 0,
    seller: { name: '', avatar: '', rating: 0, reviews: 0, joinDate: '' },
  });
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;
    try {
      const urls = await uploadImages(files);
      setImages(prev => [...prev, ...urls]);
    } catch (err) {
      // handle error, e.g. show toast
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Handle "Other" options
      const finalBrand = formData.brand === 'Other' ? formData.brandOther : formData.brand;
      const finalColor = formData.color === 'Other' ? formData.colorOther : formData.color;
      const finalMaterial = formData.material === 'Other' ? formData.materialOther : formData.material;

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        points: formData.points,
        price: formData.points, // Use points as price for compatibility
        originalPrice: formData.originalPrice,
        brand: finalBrand,
        color: finalColor,
        material: finalMaterial,
        measurements: formData.measurements,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        likes: formData.likes,
        views: formData.views,
        postedDate: formData.postedDate,
        pointsRedemption: formData.pointsRedemption,
        seller: formData.seller,
        images,
      };
      await apiService.addProduct(payload);
      // Optionally show a success toast or redirect
      alert('Product listed successfully!');
    } catch (err) {
      alert('Failed to list product.');
    }
  };

  const suggestedTags = ['vintage', 'designer', 'casual', 'formal', 'summer', 'winter', 'trendy', 'classic'];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">List</span> Your Item
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Give your clothes a new story. Share your fashion finds with the ReWear community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <Card className="glass-elevated border-glass-border/50">
              <CardHeader>
                <CardTitle className="flex justify-center items-center gap-2 gradient-text">
                  <Camera className="h-5 w-5" />
                  Photos (Required)
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  Add up to 5 photos. The first photo will be your main image.
                </p>
              </CardHeader>
              <CardContent>
                {/* Upload Area - always centered below title */}
                {images.length < 5 && (
                  <div className="flex justify-center mb-6">
                    <div
                      className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${
                        dragOver ? 'border-primary bg-primary/10' : 'border-glass-border/50'
                      } w-32 h-32`}
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground text-center px-2">
                        Click or drag images here
                      </span>
                    </div>
                  </div>
                )}
                {/* Uploaded Images Grid - centered below upload area */}
                {images.length > 0 && (
                  <div className="flex justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Upload ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border-2 border-glass-border/50"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground">
                              Main
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Item Details */}
            <Card className="glass-elevated border-glass-border/50">
              <CardHeader>
                <CardTitle className="gradient-text text-center">Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Vintage Leather Jacket"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="glass border-glass-border/50"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell the story of this item. What makes it special? How did you wear it?"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="glass border-glass-border/50 min-h-[120px]"
                    required
                  />
                </div>

                {/* Category, Size, Condition */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="glass border-glass-border/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="glass border-glass-border">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Size *</Label>
                    <Select 
                      value={formData.size} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                    >
                      <SelectTrigger className="glass border-glass-border/50">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="glass border-glass-border">
                        {sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Condition *</Label>
                    <Select 
                      value={formData.condition} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                    >
                      <SelectTrigger className="glass border-glass-border/50">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="glass border-glass-border">
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">
                    Tags (Optional)
                  </Label>
                  <Input
                    id="tags"
                    placeholder="vintage, designer, summer (separate with commas)"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="glass border-glass-border/50"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-muted-foreground mr-2">Suggested:</span>
                    {suggestedTags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/20 text-xs"
                        onClick={() => {
                          const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
                          if (!currentTags.includes(tag)) {
                            setFormData(prev => ({
                              ...prev,
                              tags: currentTags.length ? `${prev.tags}, ${tag}` : tag
                            }));
                          }
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Points Value */}
                <div className="space-y-2">
                  <Label htmlFor="points" className="text-sm font-medium">
                    Suggested Points Value
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="points"
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                      className="glass border-glass-border/50 w-32"
                      min="0"
                    />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span>Our AI suggests this value based on your item details</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Product Details */}
            <Card className="glass-elevated border-glass-border/50">
              <CardHeader>
                <CardTitle className="gradient-text text-center">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Original Price */}
                <div className="space-y-2">
                  <Label htmlFor="originalPrice" className="text-sm font-medium">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={e => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                    className="glass border-glass-border/50"
                  />
                </div>
                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
                  <Select 
                    value={formData.brand} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}
                  >
                    <SelectTrigger className="glass border-glass-border/50">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent className="glass border-glass-border">
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other" key="other">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.brand === "Other" && (
                    <Input
                      id="brandOther"
                      placeholder="Enter brand name"
                      value={formData.brandOther}
                      onChange={e => setFormData(prev => ({ ...prev, brandOther: e.target.value }))}
                      className="glass border-glass-border/50 mt-2"
                    />
                  )}
                </div>
                {/* Color */}
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-sm font-medium">Color</Label>
                  <Select 
                    value={formData.color} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                  >
                    <SelectTrigger className="glass border-glass-border/50">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent className="glass border-glass-border">
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other" key="other">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.color === "Other" && (
                    <Input
                      id="colorOther"
                      placeholder="Enter color name"
                      value={formData.colorOther}
                      onChange={e => setFormData(prev => ({ ...prev, colorOther: e.target.value }))}
                      className="glass border-glass-border/50 mt-2"
                    />
                  )}
                </div>
                {/* Material */}
                <div className="space-y-2">
                  <Label htmlFor="material" className="text-sm font-medium">Material</Label>
                  <Select 
                    value={formData.material} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, material: value }))}
                  >
                    <SelectTrigger className="glass border-glass-border/50">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent className="glass border-glass-border">
                      {materials.map((material) => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other" key="other">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.material === "Other" && (
                    <Input
                      id="materialOther"
                      placeholder="Enter material name"
                      value={formData.materialOther}
                      onChange={e => setFormData(prev => ({ ...prev, materialOther: e.target.value }))}
                      className="glass border-glass-border/50 mt-2"
                    />
                  )}
                </div>
                {/* Measurements */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chest" className="text-sm font-medium">Chest</Label>
                    <Input
                      id="chest"
                      value={formData.measurements.chest}
                      onChange={e => setFormData(prev => ({ ...prev, measurements: { ...prev.measurements, chest: e.target.value } }))}
                      className="glass border-glass-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length" className="text-sm font-medium">Length</Label>
                    <Input
                      id="length"
                      value={formData.measurements.length}
                      onChange={e => setFormData(prev => ({ ...prev, measurements: { ...prev.measurements, length: e.target.value } }))}
                      className="glass border-glass-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sleeves" className="text-sm font-medium">Sleeves</Label>
                    <Input
                      id="sleeves"
                      value={formData.measurements.sleeves}
                      onChange={e => setFormData(prev => ({ ...prev, measurements: { ...prev.measurements, sleeves: e.target.value } }))}
                      className="glass border-glass-border/50"
                    />
                  </div>
                </div>
                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="glass border-glass-border/50"
                  />
                </div>
                {/* Likes, Views, Posted Date, Points Redemption */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="likes" className="text-sm font-medium">Likes</Label>
                    <Input
                      id="likes"
                      type="number"
                      value={formData.likes}
                      onChange={e => setFormData(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                      className="glass border-glass-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="views" className="text-sm font-medium">Views</Label>
                    <Input
                      id="views"
                      type="number"
                      value={formData.views}
                      onChange={e => setFormData(prev => ({ ...prev, views: parseInt(e.target.value) || 0 }))}
                      className="glass border-glass-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postedDate" className="text-sm font-medium">Posted Date</Label>
                    <Input
                      id="postedDate"
                      type="date"
                      value={formData.postedDate}
                      onChange={e => setFormData(prev => ({ ...prev, postedDate: e.target.value }))}
                      className="glass border-glass-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pointsRedemption" className="text-sm font-medium">Points Redemption</Label>
                    <Input
                      id="pointsRedemption"
                      type="number"
                      value={formData.pointsRedemption}
                      onChange={e => setFormData(prev => ({ ...prev, pointsRedemption: parseInt(e.target.value) || 0 }))}
                      className="glass border-glass-border/50"
                    />
                  </div>
                </div>
                {/* Seller Info */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Seller Info</Label>
                  <div className="grid md:grid-cols-5 gap-4">
                    <Input
                      placeholder="Name"
                      value={formData.seller.name}
                      onChange={e => setFormData(prev => ({ ...prev, seller: { ...prev.seller, name: e.target.value } }))}
                      className="glass border-glass-border/50"
                    />
                    <Input
                      placeholder="Avatar URL"
                      value={formData.seller.avatar}
                      onChange={e => setFormData(prev => ({ ...prev, seller: { ...prev.seller, avatar: e.target.value } }))}
                      className="glass border-glass-border/50"
                    />
                    <Input
                      placeholder="Rating"
                      type="number"
                      value={formData.seller.rating}
                      onChange={e => setFormData(prev => ({ ...prev, seller: { ...prev.seller, rating: parseFloat(e.target.value) || 0 } }))}
                      className="glass border-glass-border/50"
                    />
                    <Input
                      placeholder="Reviews"
                      type="number"
                      value={formData.seller.reviews}
                      onChange={e => setFormData(prev => ({ ...prev, seller: { ...prev.seller, reviews: parseInt(e.target.value) || 0 } }))}
                      className="glass border-glass-border/50"
                    />
                    <Input
                      placeholder="Join Date"
                      type="date"
                      value={formData.seller.joinDate}
                      onChange={e => setFormData(prev => ({ ...prev, seller: { ...prev.seller, joinDate: e.target.value } }))}
                      className="glass border-glass-border/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card className="glass-elevated border-glass-border/50">
              <CardHeader>
                <CardTitle className="gradient-text text-center">Ready to Share?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow h-12 text-lg font-semibold hover-lift"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Publish Item
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1 glass border-glass-border/50 hover-glow h-12 text-lg"
                  >
                    Save as Draft
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  By publishing, you agree to our Community Guidelines and Terms of Service
                </p>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
