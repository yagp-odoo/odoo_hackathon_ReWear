import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Package, ShoppingCart, BarChart3, Eye, Edit, Trash2, Check, X } from 'lucide-react';

const AdminPanel = () => {
  const [users] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'active', joinDate: '2024-01-15', items: 12, swaps: 8 },
    { id: 2, name: 'Mike Chen', email: 'mike@example.com', status: 'active', joinDate: '2024-02-20', items: 6, swaps: 3 },
    { id: 3, name: 'Emma Wilson', email: 'emma@example.com', status: 'suspended', joinDate: '2024-01-08', items: 25, swaps: 18 },
    { id: 4, name: 'David Brown', email: 'david@example.com', status: 'active', joinDate: '2024-03-05', items: 4, swaps: 2 },
  ]);

  const [listings] = useState([
    { id: 1, title: 'Vintage Denim Jacket', user: 'Sarah Johnson', status: 'pending', category: 'Outerwear', price: 45 },
    { id: 2, title: 'Designer Handbag', user: 'Emma Wilson', status: 'approved', category: 'Accessories', price: 120 },
    { id: 3, title: 'Silk Dress', user: 'Mike Chen', status: 'pending', category: 'Dresses', price: 80 },
    { id: 4, title: 'Leather Boots', user: 'David Brown', status: 'rejected', category: 'Shoes', price: 65 },
  ]);

  const [orders] = useState([
    { id: 1, buyer: 'Sarah Johnson', seller: 'Emma Wilson', item: 'Designer Handbag', status: 'completed', date: '2024-03-10', amount: 120 },
    { id: 2, buyer: 'Mike Chen', seller: 'Sarah Johnson', item: 'Vintage Jacket', status: 'pending', date: '2024-03-12', amount: 45 },
    { id: 3, buyer: 'David Brown', seller: 'Emma Wilson', item: 'Silk Scarf', status: 'shipped', date: '2024-03-08', amount: 35 },
  ]);

  const stats = [
    { title: 'Total Users', value: '2,547', icon: Users, change: '+12%' },
    { title: 'Active Listings', value: '1,234', icon: Package, change: '+8%' },
    { title: 'Total Orders', value: '5,891', icon: ShoppingCart, change: '+23%' },
    { title: 'Revenue', value: '$45,231', icon: BarChart3, change: '+15%' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'approved': case 'completed': return 'bg-green-500';
      case 'pending': case 'shipped': return 'bg-yellow-500';
      case 'suspended': case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your ReWear platform</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="glass border-glass-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-accent">{stat.change}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass">
              <TabsTrigger value="users">Manage Users</TabsTrigger>
              <TabsTrigger value="listings">Manage Listings</TabsTrigger>
              <TabsTrigger value="orders">Manage Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="text-foreground">User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-lg glass border border-glass-border">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg`} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">Joined: {user.joinDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-foreground">{user.items} items • {user.swaps} swaps</p>
                            <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                              {user.status}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings" className="mt-6">
              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Listing Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing.id} className="flex items-center justify-between p-4 rounded-lg glass border border-glass-border">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{listing.title}</p>
                            <p className="text-sm text-muted-foreground">by {listing.user}</p>
                            <p className="text-xs text-muted-foreground">{listing.category} • ${listing.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={`${getStatusColor(listing.status)}`}>
                            {listing.status}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Card className="glass border-glass-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Order Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-lg glass border border-glass-border">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.buyer} → {order.seller}</p>
                            <p className="text-xs text-muted-foreground">{order.item} • {order.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium text-foreground">${order.amount}</p>
                            <Badge className={`${getStatusColor(order.status)}`}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;