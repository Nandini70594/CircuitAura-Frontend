import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap, Award, Users, CircuitBoard } from 'lucide-react';
import logo from '@/assets/circuitaura-logo.png';

const Home = () => {
  const features = [
    {
      icon: <CircuitBoard className="h-8 w-8 text-primary" />,
      title: 'Quality Products',
      description: 'Premium electronic components and devices',
    },
    {
      icon: <Zap className="h-8 w-8 text-secondary" />,
      title: 'Innovation',
      description: 'Cutting-edge technology solutions',
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Excellence',
      description: 'Award-winning educational kits',
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: 'Support',
      description: '24/7 customer assistance',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Electronics Professor',
      content: 'CircuitAura kits have revolutionized how we teach electronics. Outstanding quality!',
    },
    {
      name: 'Mike Chen',
      role: 'Hobbyist Engineer',
      content: 'The best electronics supplier I\'ve worked with. Fast shipping and great products.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-4">
                <img src={logo} alt="CircuitAura" className="h-16 w-16 animate-glow" />
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    CircuitAura
                  </span>
                </h1>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">
                Smart Solutions, Real Innovation
              </p>
              <p className="text-xl text-muted-foreground">
                Innovating the Future of Electronics
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className="group">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kits">
                  <Button size="lg" variant="secondary">
                    Explore Kits
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
                <img 
                  src={logo} 
                  alt="CircuitAura Logo" 
                  className="relative w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CircuitAura?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground">Discover our most popular electronics</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden group hover:shadow-lg transition-all">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Premium Product {i}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    High-quality electronic component for your projects
                  </p>
                  <Link to="/products">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Electronics Journey?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of satisfied customers worldwide
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
