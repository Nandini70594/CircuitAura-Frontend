import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Download, ShoppingCart, MessageCircle } from 'lucide-react';

interface KitCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  pdfUrl?: string;
  onBuyNow: () => void;
  onWhatsAppSupport: () => void;
}

export const KitCard = ({ name, description, price, image, pdfUrl, onBuyNow, onWhatsAppSupport }: KitCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden h-48 bg-muted">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-primary mb-4">{price}</p>
        {pdfUrl && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={pdfUrl} download>
              <Download className="h-4 w-4 mr-2" />
              Download Booklet
            </a>
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={onBuyNow} className="flex-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Order Now
        </Button>
        <Button onClick={onWhatsAppSupport} variant="secondary" className="flex-1">
          <MessageCircle className="h-4 w-4 mr-2" />
          Support
        </Button>
      </CardFooter>
    </Card>
  );
};
