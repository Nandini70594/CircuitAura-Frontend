import { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Products = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const products = [
    {
      id: 1,
      name: 'Arduino Uno R3',
      description: 'Microcontroller board based on ATmega328P with USB connectivity',
      price: '$24.99',
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=500&h=400&fit=crop',
    },
    {
      id: 2,
      name: 'Raspberry Pi 4',
      description: 'Powerful single-board computer with 4GB RAM for advanced projects',
      price: '$55.00',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'ESP32 Dev Board',
      description: 'WiFi and Bluetooth enabled microcontroller for IoT applications',
      price: '$12.99',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=400&fit=crop',
    },
    {
      id: 4,
      name: 'Sensor Kit Pro',
      description: 'Complete set of 37 sensors for Arduino and Raspberry Pi',
      price: '$34.99',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=400&fit=crop',
    },
    {
      id: 5,
      name: 'Digital Oscilloscope',
      description: 'Portable 2-channel oscilloscope with 100MHz bandwidth',
      price: '$299.00',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=400&fit=crop',
    },
    {
      id: 6,
      name: 'Soldering Station',
      description: 'Professional temperature-controlled soldering station',
      price: '$89.99',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&h=400&fit=crop',
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      toast({ title: 'Added to cart!', description: 'Product added successfully' });
    }
  };

  const handleEnquire = () => {
    const whatsappUrl = `https://wa.me/15551234567?text=Hi, I'd like to enquire about a product`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore our wide range of quality electronics
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
              onBuyNow={handleBuyNow}
              onEnquire={handleEnquire}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your search.</p>
          </div>
        )}
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Products;
