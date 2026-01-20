// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthModal } from "@/components/AuthModal";
// import { useAuth } from "@/contexts/AuthContext";
// import { useCart } from "@/contexts/CartContext";
// import { useToast } from "@/hooks/use-toast";
// import { Input } from "@/components/ui/input";
// import { Search, Loader2, ShoppingCart, MessageCircle } from "lucide-react";
// import { API, getImageUrl } from "@/config/api";

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: string;
//   image_url: string;
// }

// const Products = () => {
//   const [authModalOpen, setAuthModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const { isAuthenticated } = useAuth();
//   const { toast } = useToast();
//   const { addItem } = useCart();
//   const navigate = useNavigate();  

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(API.PRODUCTS);
//         if (!response.ok) throw new Error("Failed to fetch");
//         const data = await response.json();
//         setProducts(data);
//       } catch (err) {
//         toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, [toast]);

//   const filteredProducts = products.filter(
//     (p) =>
//       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAddToCart = (product: Product) => {
//     if (!isAuthenticated) {
//       setAuthModalOpen(true);
//       return;
//     }
//     addItem({
//       productId: product.id,
//       name: product.name,
//       price: parseFloat(product.price),
//       image: getImageUrl(product.image_url),
//       type: "product" as const,
//     }, 1);
//     toast({ title: "✅ Added!", description: product.name });
//   };

//   const handleBuyNow = (product: Product) => {
//     if (!isAuthenticated) {
//       setAuthModalOpen(true);
//       return;
//     }
//     addItem({
//       productId: product.id,
//       name: product.name,
//       price: parseFloat(product.price),
//       image: getImageUrl(product.image_url),
//       type: "product" as const,
//     }, 1);
//     navigate("/orders?tab=cart");
//   };

//   const handleEnquire = (product: Product) => {
//     const msg = `Hi! Interested in ${product.name} - ₹${product.price}`;
//     window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, "_blank");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen py-20 flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-12 bg-background">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold mb-4">Electronics Products</h1>
//           <p className="text-xl text-muted-foreground mb-8">Individual components & tools</p>
//           <div className="max-w-md mx-auto relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//             <Input
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>

//         {/* PRODUCTS GRID - FULL CARD CLICKABLE EXCEPT BUTTONS */}
// <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//   {filteredProducts.map((product) => (
//     <div key={product.id} className="group relative">
//       {/* LINK WRAPS ENTIRE CARD EXCEPT BUTTONS */}
//       <Link 
//         to={`/products/${product.id}`} 
//         className="block h-full bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all"
//       >
//         {/* IMAGE */}
//         <div className="h-48 overflow-hidden bg-muted">
//           <img
//             src={getImageUrl(product.image_url)}
//             alt={product.name}
//             className="w-full h-full object-cover hover:scale-105 transition-transform group-hover:scale-105"
//           />
//         </div>

//         {/* CONTENT */}
//         <div className="p-6 space-y-3">
//           <div className="space-y-2">
//             <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
//             <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
//             <div className="text-2xl font-bold text-primary">
//               ₹{parseFloat(product.price).toLocaleString()}
//             </div>
//           </div>
//         </div>
//       </Link>

//       {/* BUTTONS - OUTSIDE LINK */}
//       <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 pointer-events-auto z-10">
//         <button
//           onClick={() => handleBuyNow(product)}
//           className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition"
//         >
//           Buy
//         </button>
//         <button
//           onClick={() => handleAddToCart(product)}
//           className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 transition"
//         >
//           <ShoppingCart className="h-4 w-4" /> Cart
//         </button>
//         <button
//           onClick={() => handleEnquire(product)}
//           className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 transition"
//         >
//           <MessageCircle className="h-4 w-4" /> Ask
//         </button>
//       </div>
//     </div>
//   ))}
// </div>

//         {filteredProducts.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">No products found</p>
//           </div>
//         )}
//       </div>
//       <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
//     </div>
//   );
// };

// export default Products;


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

interface ProductsProps {
  openAuth?: (tab: 'login' | 'signup') => void;
}

const Products = ({ openAuth }: ProductsProps) => { 
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { addItem } = useCart();
  const navigate = useNavigate();

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
      openAuth?.('login');
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

  const handleBuyNow = (product: Product) => {
    if (!isAuthenticated) {
      openAuth?.('login');
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

  const handleEnquire = (product: Product) => {
    const msg = `Hi! Interested in ${product.name} - ₹${product.price}`;
    window.open(`https://wa.me/9322291932?text=${encodeURIComponent(msg)}`, "_blank");
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
        {/* ✅ HEADER + SEARCH BAR */}
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

        {/* ✅ COMPACT GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition h-full flex flex-col">
              <Link to={`/products/${product.id}`} className="block flex-1">
                <div className="h-48 overflow-hidden bg-muted">
                  <img 
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = '/no-image.png'; 
                    }}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="text-xl font-bold text-primary">
                    ₹{parseFloat(product.price).toLocaleString()}
                  </div>
                </div>
              </Link>
              <div className="p-3 px-4 border-t border-border">
                <div className="grid grid-cols-3 gap-1">
                  <button 
                    onClick={(e)=>{e.preventDefault();e.stopPropagation();handleBuyNow(product);}} 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-1.5 px-2 rounded-md text-xs transition"
                  >
                    Buy
                  </button>
                  <button 
                    onClick={(e)=>{e.preventDefault();e.stopPropagation();handleAddToCart(product);}} 
                    className="bg-slate-700 hover:bg-slate-800 text-white font-medium py-1.5 px-2 rounded-md text-xs flex items-center justify-center gap-1 transition"
                  >
                    <ShoppingCart className="h-3 w-3" /> Cart
                  </button>
                  <button 
                    onClick={(e)=>{e.preventDefault();e.stopPropagation();handleEnquire(product);}} 
                    className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-1.5 px-2 rounded-md text-xs flex items-center justify-center gap-1 transition"
                  >
                    <MessageCircle className="h-3 w-3" /> Ask
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
