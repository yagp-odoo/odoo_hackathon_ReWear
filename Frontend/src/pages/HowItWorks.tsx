import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Upload, 
  Search, 
  Heart, 
  ShoppingBag, 
  Users, 
  Star, 
  Shield, 
  Truck, 
  RotateCcw,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "List Your Items",
      description: "Upload photos and details of clothes you no longer wear. Set your preferred swap options.",
      color: "text-blue-400"
    },
    {
      icon: Search,
      title: "Discover & Browse",
      description: "Explore thousands of pre-loved fashion pieces from our community members.",
      color: "text-purple-400"
    },
    {
      icon: Heart,
      title: "Save to Wishlist",
      description: "Like items you love and save them to your wishlist for later.",
      color: "text-pink-400"
    },
    {
      icon: ShoppingBag,
      title: "Swap or Purchase",
      description: "Request direct swaps, use points, or purchase items with secure payment.",
      color: "text-green-400"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Community",
      description: "All members are verified to ensure safe and trustworthy exchanges."
    },
    {
      icon: Truck,
      title: "Secure Shipping",
      description: "Tracked shipping with insurance for all transactions."
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Not satisfied? Return items within 30 days for a full refund."
    },
    {
      icon: Star,
      title: "Quality Guarantee",
      description: "All items are quality-checked before listing."
    }
  ];

  const benefits = [
    "Reduce textile waste and environmental impact",
    "Save money on sustainable fashion",
    "Discover unique, vintage, and designer pieces",
    "Build a community of fashion-conscious individuals",
    "Earn points for every successful swap",
    "Access exclusive member-only events"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-primary pulse-glow" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
              </div>
              <span className="text-4xl font-bold gradient-text">ReWear</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How <span className="gradient-text">ReWear</span> Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join the sustainable fashion revolution. Swap, share, and discover pre-loved clothing 
              while reducing waste and building a conscious community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow">
                  Join ReWear
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="glass border-glass-border/50 hover-glow">
                  Start Browsing
                </Button>
              </Link>
            </div>
          </div>

          {/* How It Works Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
              Simple 4-Step Process
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="glass border-glass-border slide-up">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-full bg-glass ${step.color} bg-opacity-20`}>
                        <step.icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <Badge variant="secondary" className="mb-3">Step {index + 1}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
              Why Choose ReWear?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="glass border-glass-border hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-primary/20">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <Card className="glass-elevated border-glass-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl gradient-text">Benefits of Joining ReWear</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community Stats */}
          <div className="mb-16">
            <Card className="glass-elevated border-glass-border">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                    <div className="text-muted-foreground">Active Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary mb-2">50K+</div>
                    <div className="text-muted-foreground">Items Listed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent mb-2">25K+</div>
                    <div className="text-muted-foreground">Successful Swaps</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
                    <div className="text-muted-foreground">Satisfaction Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="glass-elevated border-glass-border">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to Start?</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of fashion-conscious individuals who are already making a difference 
                  through sustainable fashion exchanges.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow">
                      Create Account
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/browse">
                    <Button size="lg" variant="outline" className="glass border-glass-border/50 hover-glow">
                      Explore Items
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks; 