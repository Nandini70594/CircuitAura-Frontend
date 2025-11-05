import { useState } from 'react';
import { KitCard } from '@/components/KitCard';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Kits = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const kits = [
    {
      id: 1,
      name: 'Beginner Electronics Kit',
      description: 'Perfect starter kit with breadboard, LEDs, resistors, and comprehensive guide',
      price: '$39.99',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=400&fit=crop',
      pdfUrl: '/kits/beginner-guide.pdf',
    },
    {
      id: 2,
      name: 'IoT Starter Bundle',
      description: 'Everything you need to build your first IoT project with ESP32',
      price: '$79.99',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=400&fit=crop',
      pdfUrl: '/kits/iot-guide.pdf',
    },
    {
      id: 3,
      name: 'Robotics Learning Kit',
      description: 'Build and program your own robot with motors, sensors, and Arduino',
      price: '$129.99',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=400&fit=crop',
      pdfUrl: '/kits/robotics-guide.pdf',
    },
    {
      id: 4,
      name: 'Advanced PCB Design Kit',
      description: 'Learn professional PCB design with complete materials and software',
      price: '$159.99',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=400&fit=crop',
      pdfUrl: '/kits/pcb-guide.pdf',
    },
  ];

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      toast({ title: 'Order placed!', description: 'Your kit will be shipped soon' });
    }
  };

  const handleWhatsAppSupport = () => {
    const whatsappUrl = `https://wa.me/15551234567?text=Hi, I need help with a kit`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Educational Kits</h1>
          <p className="text-xl text-muted-foreground">
            Complete learning kits with everything you need to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <KitCard
              key={kit.id}
              name={kit.name}
              description={kit.description}
              price={kit.price}
              image={kit.image}
              pdfUrl={kit.pdfUrl}
              onBuyNow={handleBuyNow}
              onWhatsAppSupport={handleWhatsAppSupport}
            />
          ))}
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-muted-foreground mb-4">
            Our experts are here to help you select the perfect kit for your skill level and goals.
          </p>
          <button
            onClick={handleWhatsAppSupport}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Chat with Us on WhatsApp
          </button>
        </div>
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Kits;
