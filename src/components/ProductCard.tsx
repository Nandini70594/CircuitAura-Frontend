import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ShoppingCart, MessageSquare } from "lucide-react";

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  onBuyNow: () => void;
  onAddToCart: () => void;
  onEnquire: () => void;
}

export const ProductCard = ({
  name,
  description,
  price,
  image,
  onBuyNow,
  onAddToCart,
  onEnquire,
}: ProductCardProps) => {
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
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-primary">{price}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={onBuyNow} className="flex-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
        <Button
          onClick={onAddToCart}
          variant="outline"
          className="flex-1"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        <Button
          onClick={onEnquire}
          variant="outline"
          className="flex-1"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Enquire
        </Button>
      </CardFooter>
    </Card>
  );
};
