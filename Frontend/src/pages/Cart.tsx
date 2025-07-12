import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([
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
      quantity: 1,
      type: 'purchase'
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
      quantity: 1,
      type: 'purchase'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: number) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart."
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart."
    });
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'rewear10') {
      setDiscount(0.1);
      toast({
        title: "Promo Code Applied",
        description: "10% discount has been applied to your order."
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "The promo code you entered is not valid.",
        variant: "destructive"
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 50 ? 0 : 8.99;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  const handleCheckout = () => {
    toast({
      title: "Proceeding to Checkout",
      description: "Redirecting to secure payment..."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <Card className="glass border-glass-border">
              <CardContent className="p-12 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Discover amazing pre-loved fashion items and start shopping.
                </p>
                <Link to="/browse">
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="glass border-glass-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-foreground">Cart Items</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearCart}
                      className="text-red-400 border-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 rounded-lg glass border border-glass-border">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.brand} • Size {item.size} • {item.condition}
                          </p>
                          <p className="text-sm text-muted-foreground">Seller: {item.seller}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-bold text-primary">${item.price}</span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice}
                            </span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% Off
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-foreground">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount (10%)</span>
                        <span className="text-green-500">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">${tax.toFixed(2)}</span>
                    </div>
                    
                    <Separator className="bg-glass-border" />
                    
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary text-xl">${total.toFixed(2)}</span>
                    </div>

                    {shipping > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Promo Code */}
                <Card className="glass border-glass-border">
                  <CardContent className="p-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button onClick={applyPromoCode} variant="outline">
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow"
                  size="lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Shipping Info */}
                <Card className="glass border-glass-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Free shipping on orders over $50</p>
                        <p className="text-xs text-muted-foreground">Standard delivery 3-5 business days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Continue Shopping */}
                <Link to="/browse">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;