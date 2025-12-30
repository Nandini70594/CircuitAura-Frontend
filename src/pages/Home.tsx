import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Award, Users, CircuitBoard } from "lucide-react";
import logoLight from "@/assets/circuitaura-logo-light.png";  // NEW: White logo for dark theme
import logoDark from "@/assets/circuitaura-logo-dark.png";    // NEW: Dark logo for light theme
import { API, getImageUrl } from "@/config/api";

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const [productsRes, kitsRes] = await Promise.all([
          fetch(`${API.PRODUCTS}?limit=2`),
          fetch(`${API.KITS}?limit=1`)
        ]);
        
        const products = await productsRes.json();
        const kits = await kitsRes.json();
        
        setFeaturedItems([...products.slice(0, 2), ...kits.slice(0, 1)]);
      } catch (error) {
        console.error('Error:', error);
        setFeaturedItems([
          { id: 1, name: "Arduino Uno R3", price: "1499", image_url: "", type: "product" },
          { id: 2, name: "ESP32 Dev Board", price: "899", image_url: "", type: "product" },
          { id: 1, name: "Arduino Starter Kit", price: "2499", image_url: "", type: "kit" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedItems();
  }, []);

  const features = [
    {
      icon: <CircuitBoard className="h-8 w-8 text-primary" />,
      title: "Curated Components",
      description: "Carefully selected electronic parts for learning and prototyping.",
    },
    {
      icon: <Zap className="h-8 w-8 text-secondary" />,
      title: "Hands‑On Kits",
      description: "Project‑based kits designed for students and beginners.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Learning Focus",
      description: "Documentation and examples built around real coursework needs.",
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: "Early Community",
      description: "Improving the platform together with our first users and colleges.",
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
                {/* Light theme logo (shows on dark backgrounds) */}
                <img 
                  src={logoLight} 
                  alt="CircuitAura" 
                  className="h-16 w-16 animate-glow hidden dark:block" 
                />
                {/* Dark theme logo (shows on light backgrounds) */}
                <img 
                  src={logoDark} 
                  alt="CircuitAura" 
                  className="h-16 w-16 animate-glow block dark:hidden" 
                />
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    CircuitAura
                  </span>
                </h1>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">Smart Solutions, Real Learning</p>
              <p className="text-xl text-muted-foreground">
                An early‑stage platform for electronics components, starter kits, and learning resources.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className="group">
                    Browse Components
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kits">
                  <Button size="lg" variant="secondary">Explore Kits</Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
                {/* Light theme logo (hero image) */}
                <img 
                  src={logoLight} 
                  alt="CircuitAura Logo" 
                  className="relative w-full max-w-md mx-auto drop-shadow-2xl hidden dark:block" 
                />
                {/* Dark theme logo (hero image) */}
                <img 
                  src={logoDark} 
                  alt="CircuitAura Logo" 
                  className="relative w-full max-w-md mx-auto drop-shadow-2xl block dark:hidden" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why CircuitAura?</h2>
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

      {/* Featured Products - 2 PRODUCTS + 1 KIT - BUTTON FIXED */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Top picks from our components & kits</p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <Card key={i} className="h-80 animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-xl transition-all overflow-hidden h-auto bg-card border border-border">
                  {/* IMAGE */}
                  <Link 
                    to={item.type === 'kit' ? `/kits/${item.id}` : `/products/${item.id}`}
                    className="block h-48 overflow-hidden bg-muted"
                  >
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-product.jpg';
                      }}
                    />
                  </Link>
                  
                  {/* CONTENT - BUTTON ALWAYS VISIBLE */}
                  <CardContent className="p-6 pt-0 flex flex-col min-h-[200px] justify-between">
                    <div className="space-y-3 mb-6">
                      <Link 
                        to={item.type === 'kit' ? `/kits/${item.id}` : `/products/${item.id}`}
                        className="hover:text-primary transition block"
                      >
                        <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                      </Link>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="text-2xl font-bold text-primary">
                        ₹{parseFloat(item.price).toLocaleString()}
                      </div>
                    </div>
                    
                    {/* BUTTON SECTION */}
                    <div className="pt-4 border-t border-border">
                      <Link 
                        to={item.type === 'kit' ? `/kits/${item.id}` : `/products/${item.id}`}
                        className="block w-full"
                      >
                        <Button size="sm" className="w-full h-10 text-sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-lg">No featured items available</p>
          )}
          
          {featuredItems.length > 0 && (
            <div className="text-center mt-12">
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/products" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg group">
                  All Products <ArrowRight className="h-5 w-5 group-hover:translate-x-1" />
                </Link>
                <Link to="/kits" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg group">
                  All Kits <ArrowRight className="h-5 w-5 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ORIGINAL CTA SECTION - UNCHANGED */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start experimenting with electronics?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Be one of the first to try CircuitAura and help us shape the platform with your feedback.
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary">Shop Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
