import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Star, 
  ShoppingBag, 
  Heart, 
  TrendingUp, 
  Recycle, 
  Award,
  Plus,
  Calendar,
  MapPin,
  Mail,
  Edit3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, User as UserType } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Default user data structure
const defaultUserData = {
  name: 'User',
  email: '',
  location: '',
  joinDate: '',
  avatar: '',
  points: 0,
  rating: 0,
  totalSwaps: 0,
  itemsListed: 0,
  favoriteCount: 0,
  ecoImpact: {
    itemsSaved: 0,
    co2Saved: '0 kg',
    waterSaved: '0 L'
  }
};

const myItems = [
  {
    id: '1',
    title: 'Vintage Band T-Shirt',
    description: 'Rare concert tee from the 90s',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    category: 'T-Shirts',
    size: 'M',
    condition: 'Good',
    points: 80,
    status: 'available',
    views: 45,
    likes: 8,
    owner: {
      name: 'Alex Rivera',
      rating: 4.8
    }
  },
  {
    id: '2',
    title: 'Designer Sneakers',
    description: 'Limited edition sneakers, barely worn',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'],
    category: 'Shoes',
    size: '9',
    condition: 'Excellent',
    points: 250,
    status: 'pending',
    views: 89,
    likes: 23,
    owner: {
      name: 'Alex Rivera',
      rating: 4.8
    }
  }
];

const recentActivity = [
  {
    id: '1',
    type: 'swap_completed',
    title: 'Swap completed with Sarah Chen',
    description: 'Vintage Denim Jacket → Your Leather Boots',
    date: '2 hours ago',
    points: '+150'
  },
  {
    id: '2',
    type: 'item_liked',
    title: 'Your Designer Sneakers received a like',
    description: 'From Maya Patel',
    date: '5 hours ago',
    points: null
  },
  {
    id: '3',
    type: 'points_earned',
    title: 'Weekly challenge completed',
    description: 'Eco Warrior Badge earned',
    date: '1 day ago',
    points: '+50'
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(defaultUserData);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await apiService.getProfile();
        
        // Transform API data to match our component structure
        const transformedData = {
          name: profile.name || 'User',
          email: profile.email,
          location: profile.location || 'Location not set',
          joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          }) : 'Recently',
          avatar: profile.picture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          points: profile.points || 0,
          rating: profile.rating || 0,
          totalSwaps: profile.swaps || 0,
          itemsListed: profile.items || 0,
          favoriteCount: profile.favorites || 0,
          ecoImpact: {
            itemsSaved: profile.swaps || 0,
            co2Saved: `${((profile.swaps || 0) * 0.66).toFixed(1)} kg`,
            waterSaved: `${((profile.swaps || 0) * 54).toLocaleString()} L`
          }
        };
        
        setUserData(transformedData);
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Available</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Pending</Badge>;
      case 'swapped':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Swapped</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="glass-elevated rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={userData.avatar} 
                    alt={userData.name}
                    className="w-20 h-20 rounded-full border-4 border-primary/50"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">{userData.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{userData.rating} rating</span>
                    <span>•</span>
                    <MapPin className="h-4 w-4" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {userData.joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1" />

              <div className="flex gap-3">
                <Link to="/edit-profile">
                  <Button variant="outline" className="glass border-glass-border/50 hover-glow">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/list-item">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow">
                    <Plus className="h-4 w-4 mr-2" />
                    List Item
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-elevated border-glass-border/50 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                    <p className="text-3xl font-bold gradient-text">{userData.points}</p>
                  </div>
                  <div className="bg-gradient-to-br from-accent/20 to-primary/20 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-elevated border-glass-border/50 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Swaps</p>
                    <p className="text-3xl font-bold gradient-text">{userData.totalSwaps}</p>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/20 to-primary/20 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Recycle className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-elevated border-glass-border/50 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Items Listed</p>
                    <p className="text-3xl font-bold gradient-text">{userData.itemsListed}</p>
                  </div>
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-12 h-12 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-elevated border-glass-border/50 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                    <p className="text-3xl font-bold gradient-text">{userData.favoriteCount}</p>
                  </div>
                  <div className="bg-gradient-to-br from-accent/20 to-secondary/20 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass border-glass-border/50 h-12">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20">
                Overview
              </TabsTrigger>
              <TabsTrigger value="my-items" className="data-[state=active]:bg-primary/20">
                My Items
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-primary/20">
                Activity
              </TabsTrigger>
              <TabsTrigger value="impact" className="data-[state=active]:bg-primary/20">
                Eco Impact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 glass-elevated border-glass-border/50">
                  <CardHeader>
                    <CardTitle className="gradient-text">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 glass rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                        </div>
                        {activity.points && (
                          <Badge className="bg-accent/20 text-accent border-accent/50">
                            {activity.points}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="glass-elevated border-glass-border/50">
                  <CardHeader>
                    <CardTitle className="gradient-text">This Week</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Views</span>
                      <span className="font-semibold">134</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Likes</span>
                      <span className="font-semibold">31</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Messages</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Swaps</span>
                      <span className="font-semibold">2</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="my-items" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold gradient-text">My Listed Items</h2>
                <Link to="/list-item">
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myItems.map((item) => (
                  <div key={item.id} className="relative">
                    <ItemCard {...item} />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="glass rounded-lg p-3 mt-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Views:</span>
                        <span className="font-medium">{item.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Likes:</span>
                        <span className="font-medium">{item.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <h2 className="text-2xl font-bold gradient-text">Activity History</h2>
              
              <div className="space-y-4">
                {recentActivity.concat(recentActivity).map((activity, index) => (
                  <Card key={`${activity.id}-${index}`} className="glass-elevated border-glass-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-primary rounded-full mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                        </div>
                        {activity.points && (
                          <Badge className="bg-accent/20 text-accent border-accent/50">
                            {activity.points}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <h2 className="text-2xl font-bold gradient-text">Your Eco Impact</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="glass-elevated border-glass-border/50 hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-green-500/20 to-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Recycle className="h-8 w-8 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold gradient-text">{userData.ecoImpact.itemsSaved}</p>
                    <p className="text-sm text-muted-foreground">Items Saved from Landfill</p>
                  </CardContent>
                </Card>

                <Card className="glass-elevated border-glass-border/50 hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-blue-500/20 to-secondary/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold gradient-text">{userData.ecoImpact.co2Saved}</p>
                    <p className="text-sm text-muted-foreground">CO₂ Emissions Saved</p>
                  </CardContent>
                </Card>

                <Card className="glass-elevated border-glass-border/50 hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-br from-accent/20 to-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl">💧</div>
                    </div>
                    <p className="text-3xl font-bold gradient-text">{userData.ecoImpact.waterSaved}</p>
                    <p className="text-sm text-muted-foreground">Water Saved</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}