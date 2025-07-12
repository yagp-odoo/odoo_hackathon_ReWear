import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleAuth } from '@/components/GoogleAuth';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }
        
        await register(email, password, name);
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        navigate('/dashboard');
      } else {
        await login(email, password);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setIsLoading(true);
    try {
      await googleLogin(credential);
      toast({
        title: "Success",
        description: "Google login successful!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Google authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-4">
          {/* Logo & Welcome */}
          <div className="text-center mb-8 fade-in">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-primary pulse-glow" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
              </div>
              <span className="text-4xl font-bold gradient-text">ReWear</span>
            </div>
            <h1 className="text-3xl font-bold mb-3 gradient-text">
              {isSignup ? 'Join ReWear' : 'Welcome Back!'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isSignup 
                ? 'Start your sustainable fashion journey today'
                : 'Ready to continue your sustainable fashion journey?'
              }
            </p>
          </div>

          {/* Login Form */}
          <Card className="glass-elevated border-glass-border/50 slide-up">
            <CardHeader className="text-center pb-6">
              <CardTitle className="gradient-text text-2xl">
                {isSignup ? 'Create Account' : 'Sign In'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
                {/* Name Field (Signup only) */}
                {isSignup && (
                  <div className="space-y-2 w-full">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glass border-glass-border/50 h-12 w-full mx-auto"
                      required
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 glass border-glass-border/50 h-12 w-full mx-auto"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 w-full">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 glass border-glass-border/50 h-12 w-full mx-auto"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Signup only) */}
                {isSignup && (
                  <div className="space-y-2 w-full">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 glass border-glass-border/50 h-12 w-full mx-auto"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Forgot Password (Login only) */}
                {!isSignup && (
                  <div className="text-right">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:text-primary-glow transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow h-14 text-lg font-semibold hover-lift pulse-glow"
                >
                  {isLoading ? 'Loading...' : (isSignup ? 'Create Account' : 'Sign In')}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-glass-border/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <GoogleAuth 
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    disabled={isLoading}
                  />
                  <Button 
                    variant="outline" 
                    className="glass border-glass-border/50 hover-glow h-12 w-full"
                    type="button"
                    disabled={isLoading}
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Toggle Signup/Login */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setIsSignup(!isSignup)}
                className="text-primary hover:text-primary-glow font-semibold transition-colors"
              >
                {isSignup ? 'Sign In' : 'Join ReWear'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}