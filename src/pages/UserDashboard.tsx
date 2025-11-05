import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, BookOpen, User } from 'lucide-react';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const recentOrders = [
    { id: '1001', product: 'Arduino Uno R3', date: '2024-01-15', status: 'Delivered' },
    { id: '1002', product: 'Beginner Electronics Kit', date: '2024-01-10', status: 'In Transit' },
  ];

  const recommendations = [
    {
      name: 'ESP32 Dev Board',
      description: 'Perfect for your next IoT project',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop',
    },
    {
      name: 'Sensor Kit Pro',
      description: 'Expand your sensor collection',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your account</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Active Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Completed Courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <User className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold">Gold</p>
              <p className="text-sm text-muted-foreground">Member Status</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{order.product}</p>
                      <p className="text-sm text-muted-foreground">Order #{order.id} • {order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' 
                        ? 'bg-secondary/20 text-secondary' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">View All Orders</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Based on your purchase history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((product, index) => (
                  <div key={index} className="flex space-x-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <Button size="sm" variant="outline">View Product</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
