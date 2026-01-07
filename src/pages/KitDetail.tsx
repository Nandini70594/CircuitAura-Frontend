import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Download, MessageCircle, ShoppingCart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { API, getImageUrl } from "@/config/api";

interface Kit {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  pdf_url?: string;
  included?: string;
}

const KitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [kit, setKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKit = async () => {
      try {
        if (!id) throw new Error("No kit ID");
        const response = await fetch(`${API.KITS}/${id}`);
        if (!response.ok) throw new Error("Kit not found");
        const data = await response.json();
        setKit(data);
      } catch (err) {
        toast({ title: "Error", description: "Kit not found", variant: "destructive" });
        navigate("/kits");
      } finally {
        setLoading(false);
      }
    };
    fetchKit();
  }, [id, toast, navigate]);

  const handleAddToCart = () => {
    if (!kit || !isAuthenticated) {
      toast({ title: "Login required", description: "Please login first" });
      return;
    }
    addItem({
      productId: kit.id,
      name: kit.name,
      price: parseFloat(kit.price),
      image: getImageUrl(kit.image_url),
      type: "kit" as const,
    }, 1);
    toast({ title: "✅ Added!", description: kit.name });
  };

  const handleBuyNow = () => {
    if (!kit || !isAuthenticated) {
      toast({ title: "Login required", description: "Please login first" });
      return;
    }
    addItem({
      productId: kit.id,
      name: kit.name,
      price: parseFloat(kit.price),
      image: getImageUrl(kit.image_url),
      type: "kit" as const,
    }, 1);
    navigate("/orders?tab=cart");
  };

  const handleEnquire = () => {
    if (!kit) return;
    const msg = `Hi! Interested in ${kit.name} - ₹${kit.price}`;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!kit) return null;

  const includedList = kit.included 
    ? kit.included.split(',').map(i => i.trim()).filter(i => i.length > 0)
    : [];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/kits")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* IMAGE */}
          <div className="flex items-center justify-center">
            <img
  src={getImageUrl(kit.image_url)}
  alt={kit.name}
  className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/no-image.png';
  }}
/>
          </div>

          {/* DETAILS */}
          <div className="space-y-4">
            {/* TITLE & PRICE */}
            <div>
              <Badge className="mb-2">Kit</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{kit.name}</h1>
              <p className="text-2xl font-bold text-primary">₹{parseFloat(kit.price).toLocaleString()}</p>
            </div>

            <Separator />

            {/* DESCRIPTION */}
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {kit.description}
              </p>
            </div>

            <Separator />

            {/* INCLUDED */}
            {includedList.length > 0 && (
              <div>
                <h3 className="font-bold text-base mb-2">What's Included:</h3>
                <ul className="space-y-1">
                  {includedList.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {/* BUY NOW - REDIRECTS TO ORDERS */}
              <Button
                size="sm"
                onClick={handleBuyNow}
                disabled={!isAuthenticated}
                className="h-10 text-sm"
              >
                Buy Now
              </Button>

              {/* ADD TO CART - STAYS ON PAGE */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddToCart}
                disabled={!isAuthenticated}
                className="h-10 text-sm"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>

              {/* ENQUIRE - OPENS WHATSAPP */}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEnquire}
                className="h-10 text-sm"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>

              {/* PDF DOWNLOAD */}
              {kit.pdf_url && (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="h-10 text-sm col-span-3"
                >
                  <a href={getImageUrl(kit.pdf_url)} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    PDF
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitDetail;
