import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, MessageCircle, ShoppingCart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { API, getImageUrl } from "@/config/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  features?: string;
  included?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) throw new Error("No product ID");
        const response = await fetch(`${API.PRODUCTS}/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        toast({ title: "Error", description: "Product not found", variant: "destructive" });
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, toast, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  // ✅ FIX: Unescape literal "\\n" → split on actual newlines
  const parseFeatures = (raw: string | undefined): string[] => {
    if (!raw) return [];
    // Replace literal "\\n" with real \n, then split
    const unescaped = raw.replace(/\\n/g, '\n');
    return unescaped.split(/\r?\n/).map(f => f.trim()).filter(f => f.length > 0);
  };

  const featuresList = parseFeatures(product.features);
  const includedList = product.included
    ? product.included.split(',').map(i => i.trim()).filter(i => i.length > 0)
    : [];

  // DEBUG
  console.log('Raw features:', product.features);
  console.log('Unescaped:', product.features?.replace(/\\n/g, '\n'));
  console.log('Parsed features list:', featuresList.length, featuresList);

  const handleAddToCart = () => {
    if (!product || !isAuthenticated) {
      toast({ title: "Login required", description: "Please login first" });
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: getImageUrl(product.image_url),
      type: "product" as const,
    }, 1);
    toast({ title: "✅ Added!", description: product.name });
  };

  const handleBuyNow = () => {
    if (!product || !isAuthenticated) {
      toast({ title: "Login required", description: "Please login first" });
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: getImageUrl(product.image_url),
      type: "product" as const,
    }, 1);
    navigate("/orders?tab=cart");
  };

  const handleEnquire = () => {
    if (!product) return;
    const msg = `Hi! Interested in ${product.name} - ₹${product.price}`;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* IMAGE */}
          <div className="flex items-center justify-center">
            <img
              src={getImageUrl(product.image_url)}
              alt={product.name}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = '/no-image.png'; 
              }}
            />
          </div>

          {/* DETAILS */}
          <div className="space-y-6">
            {/* TITLE & PRICE */}
            <div>
              <Badge className="mb-2">Product</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-primary">₹{parseFloat(product.price).toLocaleString()}</p>
            </div>

            <Separator />

            {/* DESCRIPTION */}
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* FEATURES */}
            {featuresList.length > 0 && (
              <div>
                <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  Features
                </h3>
                <ul className="space-y-1.5 pl-0 list-none">
                  {featuresList.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* INCLUDED */}
            {includedList.length > 0 && (
              <div>
                <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  Included
                </h3>
                <ul className="space-y-1.5 pl-0 list-none">
                  {includedList.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* BUTTONS */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                size="sm"
                onClick={handleBuyNow}
                disabled={!isAuthenticated}
                className="h-10 text-sm"
              >
                Buy Now
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddToCart}
                disabled={!isAuthenticated}
                className="h-10 text-sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEnquire}
                className="h-10 text-sm justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Enquire
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
