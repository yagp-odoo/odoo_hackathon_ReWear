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

const categories = [
  'Dresses', 'Tops', 'Bottoms', 'Jackets', 'Sweaters', 'Shoes', 
  'Accessories', 'Bags', 'Jewelry', 'Other'
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const conditions = ['Excellent', 'Good', 'Fair'];

export default function ListItem() {
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    tags: '',
    points: 100
  });
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting item:', { ...formData, images });
    // Handle form submission
  };

  const suggestedTags = ['vintage', 'designer', 'casual', 'formal', 'summer', 'winter', 'trendy', 'classic'];

  return (
    <div className="min-h-screen">
      <Header isAuthenticated={true} user={{ name: 'You', points: 850 }} />
      
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
                <CardTitle className="flex items-center gap-2 gradient-text">
                  <Camera className="h-5 w-5" />
                  Photos (Required)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add up to 5 photos. The first photo will be your main image.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Existing Images */}
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

                  {/* Upload Area */}
                  {images.length < 5 && (
                    <div
                      className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${
                        dragOver ? 'border-primary bg-primary/10' : 'border-glass-border/50'
                      }`}
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
                  )}
                </div>

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
                <CardTitle className="gradient-text">Item Details</CardTitle>
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

            {/* Publishing Options */}
            <Card className="glass-elevated border-glass-border/50">
              <CardHeader>
                <CardTitle className="gradient-text">Ready to Share?</CardTitle>
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
