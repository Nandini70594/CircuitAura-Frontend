import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Loader2, ShoppingCart, MessageCircle } from "lucide-react";

import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { API } from "@/config/api";


interface Kit {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  included?: string;
}


const getImageUrl = (url?: string) => {
  if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
  return url.trim();
};


const Kits = () => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();


  useEffect(() => {
    const fetchKits = async () => {
      try {
        const res = await fetch(API.KITS);
        if (!res.ok) throw new Error("Failed to fetch kits");

        const data = await res.json();
        setKits(data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load kits",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKits();
  }, [toast]);


  const filteredKits = kits.filter((kit) =>
    `${kit.name} ${kit.description} ${kit.included || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );


  const handleAddToCart = (kit: Kit) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    addItem(
      {
        productId: kit.id,
        name: kit.name,
        price: Number(kit.price),
        image: getImageUrl(kit.image_url),
        type: "kit",
      },
      1
    );

    toast({ title: "✅ Added to cart", description: kit.name });
  };

  const handleEnquire = (kit: Kit) => {
    const msg = `Hi! Interested in ${kit.name} - ₹${kit.price}`;
    window.open(
      `https://wa.me/919999999999?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Educational Kits</h1>
          <p className="text-muted-foreground mb-6">
            Complete electronics & learning kits
          </p>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search kits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKits.map((kit) => (
            <div
              key={kit.id}
              className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              {/* IMAGE */}
              <Link to={`/kits/${kit.id}`} className="block h-48 bg-muted">
                <img
  src={getImageUrl(kit.image_url)}
  alt={kit.name}
  className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = '/no-image.png';
  }}
/>
              </Link>

              {/* CONTENT */}
              <div className="p-4 space-y-3">
                <Link to={`/kits/${kit.id}`}>
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {kit.name}
                  </h3>
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {kit.description}
                </p>

                <div className="text-2xl font-bold text-primary">
                  ₹{Number(kit.price).toLocaleString()}
                </div>

                {kit.included && (
                  <p className="text-xs text-muted-foreground">
                    📦 {kit.included.split(",").length} items included
                  </p>
                )}

                {/* BUTTONS */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Link
                    to={`/kits/${kit.id}`}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg py-2 text-center text-sm"
                  >
                    Buy
                  </Link>

                  <button
                    onClick={() => handleAddToCart(kit)}
                    className="bg-slate-700 hover:bg-slate-800 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                  </button>

                  <button
                    onClick={() => handleEnquire(kit)}
                    className="bg-slate-600 hover:bg-slate-700 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ask
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredKits.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">
            No kits found
          </p>
        )}
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Kits;
