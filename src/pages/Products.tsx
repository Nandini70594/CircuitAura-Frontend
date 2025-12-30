import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ShoppingCart, MessageCircle } from "lucide-react";
import { API, getImageUrl } from "@/config/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
}

const Products = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { addItem } = useCart();
  const navigate = useNavigate();  // ✅ ADD THIS

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API.PRODUCTS);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    // ✅ JUST ADD TO CART - STAY ON PAGE
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: getImageUrl(product.image_url),
      type: "product" as const,
    }, 1);
    toast({ title: "✅ Added!", description: product.name });
  };

  const handleBuyNow = (product: Product) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    // ✅ ADD TO CART + REDIRECT TO ORDERS
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: getImageUrl(product.image_url),
      type: "product" as const,
    }, 1);
    // ✅ USE NAVIGATE INSTEAD OF window.location.href
    navigate("/orders?tab=cart");
  };

  const handleEnquire = (product: Product) => {
    const msg = `Hi! Interested in ${product.name} - ₹${product.price}`;
    window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Electronics Products</h1>
          <p className="text-xl text-muted-foreground mb-8">Individual components & tools</p>
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

        {/* PRODUCTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                
                {/* IMAGE */}
                <div className="h-48 overflow-hidden bg-muted">
                  <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  {/* TITLE & DESC */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="text-2xl font-bold text-primary">
                    ₹{parseFloat(product.price).toLocaleString()}
                  </div>

                  {/* ✅ BUTTONS - SAME AS KITS */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {/* BUY NOW - REDIRECTS TO ORDERS */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleBuyNow(product);
                      }}
                      className="col-span-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-3 rounded-lg text-center text-sm transition"
                    >
                      Buy
                    </button>

                    {/* ADD TO CART - STAYS ON PAGE */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="col-span-1 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 transition"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                    </button>

                    {/* ENQUIRE - OPENS WHATSAPP */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleEnquire(product);
                      }}
                      className="col-span-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 transition"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Ask
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Products;
