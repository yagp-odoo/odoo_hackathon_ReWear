import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Recycle, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-fashion.jpg';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-glass/30 to-background">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Fashion revolution" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <div className="fade-in">
          <div className="inline-flex items-center px-4 py-2 glass rounded-full mb-6 hover-glow">
            <Sparkles className="h-4 w-4 text-accent mr-2" />
            <span className="text-sm font-medium gradient-text">Where Fashion Finds a Second Life</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="gradient-text">ReWear</span>
            <br />
            <span className="text-foreground/90">Revolution</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            🚀 <span className="gradient-text font-semibold">Swap. Shine. Sustain.</span>
            <br />
            Step into a world where your wardrobe is a playground and every garment tells a story.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="slide-up flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/browse">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow hover-lift px-8 py-4 text-lg font-semibold group"
            >
              Start Swapping
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link to="/browse">
            <Button 
              variant="outline" 
              size="lg" 
              className="glass border-glass-border hover-glow px-8 py-4 text-lg font-semibold"
            >
              Browse Items
            </Button>
          </Link>
          
          <Link to="/list-item">
            <Button 
              variant="ghost" 
              size="lg" 
              className="glass hover-glow px-8 py-4 text-lg font-semibold"
            >
              List an Item
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-elevated p-6 rounded-2xl hover-lift group">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <Recycle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 gradient-text">Eco-Chic</h3>
            <p className="text-muted-foreground text-sm">
              Give your clothes a second story while saving the planet, one swap at a time.
            </p>
          </div>

          <div className="glass-elevated p-6 rounded-2xl hover-lift group">
            <div className="bg-gradient-to-br from-accent/20 to-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 gradient-text">Community</h3>
            <p className="text-muted-foreground text-sm">
              Connect with fashion lovers, share stories, and build lasting friendships.
            </p>
          </div>

          <div className="glass-elevated p-6 rounded-2xl hover-lift group">
            <div className="bg-gradient-to-br from-secondary/20 to-accent/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 gradient-text">Instant Impact</h3>
            <p className="text-muted-foreground text-sm">
              Track your eco-savings and style impact with our gamified dashboard.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 fade-in">
          <p className="text-muted-foreground mb-4">Join thousands of fashion revolutionaries</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold gradient-text">10K+</span>
              <span className="text-xs text-muted-foreground ml-1">Members</span>
            </div>
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold gradient-text">50K+</span>
              <span className="text-xs text-muted-foreground ml-1">Swaps</span>
            </div>
            <div className="glass px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold gradient-text">100K+</span>
              <span className="text-xs text-muted-foreground ml-1">Items Saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};