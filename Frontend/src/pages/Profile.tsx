import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Edit, Save, MapPin, Calendar, Star, Award, TrendingUp, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    bio: 'Fashion enthusiast and sustainability advocate. Love finding unique pieces and giving them new life!',
    location: 'New York, NY',
    joinDate: 'January 2024',
    avatar: '/placeholder.svg'
  });

  const stats = [
    { label: 'Items Listed', value: '24', icon: Package, color: 'text-blue-500' },
    { label: 'Successful Swaps', value: '18', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Points Earned', value: '2,840', icon: Award, color: 'text-yellow-500' },
    { label: 'Rating', value: '4.9', icon: Star, color: 'text-purple-500' },
  ];

  const recentActivity = [
    { id: 1, type: 'swap', description: 'Completed swap: Vintage Denim Jacket', date: '2 days ago', points: '+120' },
    { id: 2, type: 'listing', description: 'Listed new item: Designer Handbag', date: '1 week ago', points: '+50' },
    { id: 3, type: 'review', description: 'Received 5-star review from Emma W.', date: '1 week ago', points: '+25' },
    { id: 4, type: 'swap', description: 'Completed swap: Silk Scarf', date: '2 weeks ago', points: '+80' },
  ];

  const achievements = [
    { id: 1, title: 'Early Adopter', description: 'Joined ReWear in the first month', icon: '🚀', earned: true },
    { id: 2, title: 'Eco Warrior', description: 'Completed 10+ sustainable swaps', icon: '🌱', earned: true },
    { id: 3, title: 'Style Guru', description: 'Received 50+ positive reviews', icon: '✨', earned: false },
    { id: 4, title: 'Community Star', description: 'Top 10% most active users', icon: '⭐', earned: true },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
  };

  const handleImageUpload = () => {
    toast({
      title: "Upload Photo",
      description: "Photo upload functionality would be implemented here."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <Card className="glass border-glass-border mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-2xl">{profileData.name[0]}</AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={handleImageUpload}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h1 className="text-2xl font-bold text-foreground">{profileData.name}</h1>
                    <Button 
                      size="sm" 
                      variant={isEditing ? "default" : "outline"}
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                      {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditing ? 'Save' : 'Edit Profile'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profileData.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Member since {profileData.joinDate}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground max-w-2xl">{profileData.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass border-glass-border">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6">
              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg glass border border-glass-border">
                        <div>
                          <p className="font-medium text-foreground">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {activity.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id} 
                        className={`p-4 rounded-lg border transition-all ${
                          achievement.earned 
                            ? 'glass border-glass-border' 
                            : 'bg-muted/20 border-muted/30 opacity-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-medium text-foreground">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          {achievement.earned && (
                            <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                              Earned
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="space-y-6">
                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-glass-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications about swaps and messages</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Privacy Settings</p>
                        <p className="text-sm text-muted-foreground">Control who can see your profile and activity</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Account Security</p>
                        <p className="text-sm text-muted-foreground">Update password and security settings</p>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;