import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Users, Award, Star, TrendingUp } from 'lucide-react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('stories');

  const communityStats = [
    { label: 'Active Members', value: '12.5K', icon: Users, change: '+15%' },
    { label: 'Items Swapped', value: '45.2K', icon: TrendingUp, change: '+23%' },
    { label: 'CO2 Saved', value: '890kg', icon: Award, change: '+18%' },
    { label: 'Top Contributors', value: '250', icon: Star, change: '+12%' },
  ];

  const featuredStories = [
    {
      id: 1,
      user: { name: 'Sarah M.', avatar: '/placeholder.svg', level: 'Style Maven' },
      title: 'From Fast Fashion to Forever Pieces',
      excerpt: 'How ReWear helped me build a sustainable wardrobe...',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      likes: 234,
      comments: 45,
      tags: ['sustainable', 'transformation']
    },
    {
      id: 2,
      user: { name: 'Alex Chen', avatar: '/placeholder.svg', level: 'Eco Warrior' },
      title: 'My 30-Day Zero Waste Challenge',
      excerpt: 'Living entirely through swaps and secondhand finds...',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400',
      likes: 189,
      comments: 32,
      tags: ['challenge', 'zerowaste']
    },
    {
      id: 3,
      user: { name: 'Maya P.', avatar: '/placeholder.svg', level: 'Trend Setter' },
      title: 'Vintage Finds That Transformed My Style',
      excerpt: 'Discovering unique pieces through the ReWear community...',
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
      likes: 156,
      comments: 28,
      tags: ['vintage', 'style']
    }
  ];

  const topContributors = [
    { name: 'Emma Wilson', points: 2840, swaps: 47, level: 'Style Icon' },
    { name: 'Jordan Lee', points: 2650, swaps: 42, level: 'Eco Champion' },
    { name: 'Riley Parker', points: 2490, swaps: 38, level: 'Trend Setter' },
    { name: 'Casey Moore', points: 2210, swaps: 35, level: 'Fashion Guru' },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              ReWear Community
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect with fellow fashion lovers, share your style journey, and inspire sustainable choices together.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {communityStats.map((stat, index) => (
              <Card key={index} className="glass border-glass-border hover-glow">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-xs text-accent mt-1">{stat.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="glass rounded-full p-1 inline-flex">
              {['stories', 'leaderboard', 'challenges'].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-6 ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'stories' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <Card key={story.id} className="glass border-glass-border hover-glow overflow-hidden group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={story.user.avatar} />
                        <AvatarFallback>{story.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{story.user.name}</p>
                        <p className="text-xs text-accent">{story.user.level}</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{story.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{story.excerpt}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                          <Heart className="h-4 w-4" />
                          <span>{story.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>{story.comments}</span>
                        </button>
                      </div>
                      <button className="hover:text-primary transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <Card className="glass border-glass-border">
              <CardHeader>
                <CardTitle className="text-center text-foreground">Top Contributors This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={contributor.name} className="flex items-center justify-between p-4 rounded-lg glass">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <Avatar>
                          <AvatarFallback>{contributor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{contributor.name}</p>
                          <p className="text-sm text-accent">{contributor.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{contributor.points} pts</p>
                        <p className="text-sm text-muted-foreground">{contributor.swaps} swaps</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'challenges' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Current Challenges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="font-semibold text-primary mb-2">30-Day Sustainable Style</h4>
                    <p className="text-sm text-muted-foreground mb-3">Complete 10 swaps using only pre-loved items</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress: 6/10</span>
                      <span className="text-accent">🏆 500 points</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <h4 className="font-semibold text-secondary mb-2">Vintage Finder</h4>
                    <p className="text-sm text-muted-foreground mb-3">Discover and swap 5 vintage pieces this month</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress: 2/5</span>
                      <span className="text-accent">🏆 300 points</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Community Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold text-primary mb-2">1,000kg CO2</h4>
                    <p className="text-muted-foreground mb-4">Saved this month</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{width: '89%'}}></div>
                    </div>
                    <p className="text-sm text-accent mt-2">890kg / 1,000kg (89%)</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    Join the Movement
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Join Community CTA */}
          <div className="text-center mt-16">
            <Card className="glass border-glass-border max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold gradient-text mb-4">Ready to Join Our Community?</h3>
                <p className="text-muted-foreground mb-6">
                  Share your story, connect with like-minded fashion lovers, and make a positive impact together.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow">
                  Share Your Story
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;