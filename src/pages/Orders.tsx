// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { useCart } from "@/contexts/CartContext";
// import { useToast } from "@/hooks/use-toast";
// import { API } from "@/config/api";        // ✅ use central API config
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "@/components/ui/tabs";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const Orders = () => {
//   const { user, token, isAuthenticated } = useAuth();
//   const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
//   const { toast } = useToast();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [orders, setOrders] = useState<any[]>([]);

//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [address, setAddress] = useState({
//     name: "",
//     phone: "",
//     pincode: "",
//     city: "",
//     address: "",
//   });

//   const isPhoneValid =
//     address.phone.length === 10 && /^\d{10}$/.test(address.phone);
//   const isPincodeValid =
//     address.pincode.length === 6 && /^\d{6}$/.test(address.pincode);
//   const isFormValid =
//     address.name.trim() &&
//     isPhoneValid &&
//     isPincodeValid &&
//     address.city.trim() &&
//     address.address.trim();

//   const activeTab = searchParams.get("tab") || "cart";

//   const fetchMyOrders = async () => {
//     if (!token) return;
//     try {
//       const res = await fetch(`${API.BASE}/orders/my-orders`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch orders");
//       const data = await res.json();
//       setOrders(data);
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchMyOrders();
//     }
//   }, [token, isAuthenticated]);

//   const handlePlaceOrder = () => {
//     if (!items.length) {
//       toast({
//         title: "Cart is empty",
//         description: "Add some items before placing an order.",
//         variant: "destructive",
//       });
//       return;
//     }
//     setShowAddressModal(true);
//   };

//   const handleConfirmOrder = async () => {
//     if (!isFormValid) return;

//     try {
//       const res = await fetch(`${API.BASE}/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//         body: JSON.stringify({
//           items: items.map((i) => ({
//             product_id: i.productId,
//             product_name: i.name,
//             unit_price: i.price,
//             quantity: i.quantity,
//             type: i.type || "product",
//           })),
//           customer_name: address.name,
//           customer_email: user?.email || "",
//           customer_phone: address.phone,
//           customer_pincode: address.pincode,
//           customer_city: address.city,
//           customer_address: address.address,
//           total_amount: totalAmount,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         toast({
//           title: "Order failed",
//           description: errorData.message || "Could not place order",
//           variant: "destructive",
//         });
//         return;
//       }

//       const orderData = await res.json();
//       clearCart();
//       toast({
//         title: "✅ Order placed!",
//         description: `Order #${orderData.id} created successfully.`,
//       });

//       setShowAddressModal(false);
//       setAddress({
//         name: "",
//         phone: "",
//         pincode: "",
//         city: "",
//         address: "",
//       });
//       setSearchParams({ tab: "orders" });
//       fetchMyOrders();
//     } catch (error) {
//       console.error("Order failed:", error);
//       toast({
//         title: "Error",
//         description: "Could not place order.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleCancelOrder = async (orderId: number) => {
//     const ok = window.confirm("Are you sure you want to cancel this order?");
//     if (!ok) return;
//     try {
//       const res = await fetch(`${API.BASE}/orders/${orderId}/cancel`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         toast({
//           title: "Cannot cancel",
//           description: data.message || "Failed to cancel order",
//           variant: "destructive",
//         });
//         return;
//       }
//       setOrders((prev) =>
//         prev.map((o) =>
//           o.id === orderId ? { ...o, status: "cancelled" } : o
//         )
//       );
//       toast({
//         title: "Order cancelled",
//         description: "Your order has been cancelled.",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to cancel order.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleRemoveOrder = async (orderId: number) => {
//     const ok = window.confirm("Remove this order permanently?");
//     if (!ok) return;
//     try {
//       const res = await fetch(`${API.BASE}/orders/${orderId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         toast({
//           title: "Cannot remove",
//           description: data.message || "Failed to remove order",
//           variant: "destructive",
//         });
//         return;
//       }
//       setOrders((prev) => prev.filter((o) => o.id !== orderId));
//       toast({
//         title: "Order removed",
//         description: "Order has been permanently removed.",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to remove order.",
//         variant: "destructive",
//       });
//     }
//   };

//   if (!isAuthenticated || !user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-muted-foreground">
//           Please log in to view your cart and orders.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {showAddressModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-background rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-foreground">
//                 📍 Delivery Address
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowAddressModal(false);
//                   setAddress({
//                     name: "",
//                     phone: "",
//                     pincode: "",
//                     city: "",
//                     address: "",
//                   });
//                 }}
//                 className="text-xl hover:text-destructive text-muted-foreground p-1 -m-1"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-foreground">
//                   Full Name
//                 </label>
//                 <Input
//                   value={address.name}
//                   onChange={(e) =>
//                     setAddress((prev) => ({ ...prev, name: e.target.value }))
//                   }
//                   placeholder="Nandini Rahane"
//                   className="h-11"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-foreground">
//                   Phone
//                 </label>
//                 <Input
//                   type="tel"
//                   value={address.phone}
//                   maxLength={10}
//                   onChange={(e) =>
//                     setAddress((prev) => ({
//                       ...prev,
//                       phone: e.target.value.replace(/\D/g, ""),
//                     }))
//                   }
//                   placeholder="9322291932"
//                   className={`h-11 ${
//                     !isPhoneValid && address.phone
//                       ? "border-destructive focus:ring-destructive"
//                       : ""
//                   }`}
//                 />
//                 {!isPhoneValid && address.phone && (
//                   <p className="text-xs text-destructive mt-1">
//                     Phone must be 10 digits
//                   </p>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-foreground">
//                     Pincode
//                   </label>
//                   <Input
//                     value={address.pincode}
//                     maxLength={6}
//                     onChange={(e) =>
//                       setAddress((prev) => ({
//                         ...prev,
//                         pincode: e.target.value.replace(/\D/g, ""),
//                       }))
//                     }
//                     placeholder="411030"
//                     className={`h-11 ${
//                       !isPincodeValid && address.pincode
//                         ? "border-destructive focus:ring-destructive"
//                         : ""
//                     }`}
//                   />
//                   {!isPincodeValid && address.pincode && (
//                     <p className="text-xs text-destructive mt-1">
//                       Pincode must be 6 digits
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-foreground">
//                     City
//                   </label>
//                   <Input
//                     value={address.city}
//                     onChange={(e) =>
//                       setAddress((prev) => ({
//                         ...prev,
//                         city: e.target.value,
//                       }))
//                     }
//                     placeholder="Pune"
//                     className="h-11"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-foreground">
//                   Complete Address
//                 </label>
//                 <textarea
//                   className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-vertical h-24 min-h-[100px]"
//                   rows={3}
//                   value={address.address}
//                   onChange={(e) =>
//                     setAddress((prev) => ({
//                       ...prev,
//                       address: e.target.value,
//                     }))
//                   }
//                   placeholder="Flat 101, Sunshine Apartments, Baner, Landmark: Near McDonalds..."
//                   autoComplete="street-address"
//                 />
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <Button
//                   onClick={handleConfirmOrder}
//                   disabled={!isFormValid}
//                   size="lg"
//                   className="flex-1 h-11 text-base font-semibold"
//                 >
//                   Confirm COD (₹{totalAmount.toFixed(2)})
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     setShowAddressModal(false);
//                     setAddress({
//                       name: "",
//                       phone: "",
//                       pincode: "",
//                       city: "",
//                       address: "",
//                     });
//                   }}
//                   variant="outline"
//                   size="lg"
//                   className="flex-1 h-11 text-base font-semibold"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="min-h-screen py-12">
//         <div className="container mx-auto px-4">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
//             <p className="text-muted-foreground">
//               Manage your cart and track your purchases
//             </p>
//           </div>

//           <Tabs
//             value={activeTab}
//             onValueChange={(v) => setSearchParams({ tab: v })}
//             className="w-full"
//           >
//             <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
//               <TabsTrigger value="cart">Cart</TabsTrigger>
//               <TabsTrigger value="orders">My Orders</TabsTrigger>
//             </TabsList>

//             <TabsContent value="cart">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Your Cart</CardTitle>
//                   <CardDescription>
//                     Review items before placing your order
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {items.length === 0 ? (
//                     <p className="text-sm text-muted-foreground">
//                       Your cart is empty.
//                     </p>
//                   ) : (
//                     <>
//                       {items.map((item) => (
//                         <div
//                           key={`${item.type}-${item.productId}`}
//                           className="flex justify-between items-center border border-border rounded-lg p-3"
//                         >
//                           <div>
//                             <p className="font-medium text-sm">{item.name}</p>
//                             <p className="text-xs text-muted-foreground">
//                               ₹{item.price} × {item.quantity}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Input
//                               type="number"
//                               min={1}
//                               value={item.quantity}
//                               onChange={(e) =>
//                                 updateQuantity(
//                                   item.productId,
//                                   item.type,
//                                   Math.max(
//                                     1,
//                                     Number(e.target.value) || 1
//                                   )
//                                 )
//                               }
//                               className="w-16 text-xs h-9"
//                             />
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() =>
//                                 removeItem(item.productId, item.type)
//                               }
//                               className="h-9 px-3 text-xs"
//                             >
//                               Remove
//                             </Button>
//                           </div>
//                         </div>
//                       ))}
//                       <div className="flex justify-between items-center pt-4 border-t">
//                         <p className="font-semibold text-xl">
//                           Total: ₹{totalAmount.toFixed(2)}
//                         </p>
//                         <Button
//                           onClick={handlePlaceOrder}
//                           size="lg"
//                           className="w-40 h-11 bg-green-600 hover:bg-green-700"
//                         >
//                           Place COD Order
//                         </Button>
//                       </div>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="orders">
//               <Card>
//                 <CardHeader className="py-3">
//                   <CardTitle className="text-xl">📦 My Orders</CardTitle>
//                   <CardDescription>Your order history</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {orders.length === 0 ? (
//                     <p className="text-sm text-muted-foreground">
//                       No orders yet.
//                     </p>
//                   ) : (
//                     <div className="space-y-3">
//                       {orders.map((order: any) => (
//                         <Card
//                           key={order.id}
//                           className="p-3 hover:shadow-md border-border"
//                         >
//                           <div className="relative">
//                             <div className="flex items-center gap-1.5 absolute top-2 right-2">
//                               <span
//                                 className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
//                                   order.status === "delivered"
//                                     ? "bg-green-100 text-green-800"
//                                     : order.status === "cancelled"
//                                     ? "bg-red-100 text-red-800"
//                                     : "bg-yellow-100 text-yellow-800"
//                                 }`}
//                               >
//                                 {order.status}
//                               </span>

//                               {order.status === "pending" && (
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() =>
//                                     handleCancelOrder(order.id)
//                                   }
//                                   className="w-14 h-6 text-xs border-destructive hover:bg-destructive/5 shadow-sm px-1 ml-1"
//                                 >
//                                   Cancel
//                                 </Button>
//                               )}

//                               {order.status === "cancelled" && (
//                                 <Button
//                                   variant="destructive"
//                                   size="sm"
//                                   onClick={() =>
//                                     handleRemoveOrder(order.id)
//                                   }
//                                   className="w-14 h-6 text-xs shadow-sm px-1 ml-1"
//                                 >
//                                   Remove
//                                 </Button>
//                               )}
//                             </div>

//                             <div className="pl-2 pr-24 pt-8 pb-1">
//                               <div className="mb-1">
//                                 <p className="font-bold text-sm">
//                                   ₹{order.total_amount}
//                                 </p>
//                               </div>

//                               <div className="space-y-0.5 text-xs">
//                                 {order.items?.slice(0, 2).map((item: any) => (
//                                   <div
//                                     key={item.product_id}
//                                     className="flex justify-between py-0.5"
//                                   >
//                                     <span className="truncate text-muted-foreground max-w-[70%]">
//                                       {item.product_name} × {item.quantity}
//                                     </span>
//                                     <span>₹{item.line_total}</span>
//                                   </div>
//                                 ))}
//                                 {order.items?.length > 2 && (
//                                   <p className="text-xs text-muted-foreground">
//                                     +{order.items.length - 2} more
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </Card>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Orders;


import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { API } from "@/config/api";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Orders = () => {
  const { user, token, isAuthenticated } = useAuth();
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    address: "",
  });

  const isPhoneValid =
    address.phone.length === 10 && /^\d{10}$/.test(address.phone);
  const isPincodeValid =
    address.pincode.length === 6 && /^\d{6}$/.test(address.pincode);
  const isFormValid =
    address.name.trim() &&
    isPhoneValid &&
    isPincodeValid &&
    address.city.trim() &&
    address.address.trim();

  const activeTab = searchParams.get("tab") || "cart";

  // Fetch orders based on user role
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const endpoint =
        user?.role === "admin" ? API.ORDERS : `${API.ORDERS}/my-orders`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [token, isAuthenticated]);

  // Place COD order
  const handlePlaceOrder = () => {
    if (!items.length) {
      toast({
        title: "Cart is empty",
        description: "Add some items before placing an order.",
        variant: "destructive",
      });
      return;
    }
    setShowAddressModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!isFormValid) return;

    try {
      const res = await fetch(API.ORDERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.productId,
            product_name: i.name,
            unit_price: i.price,
            quantity: i.quantity,
            type: i.type || "product",
          })),
          customer_name: address.name,
          customer_email: user?.email || "",
          customer_phone: address.phone,
          customer_pincode: address.pincode,
          customer_city: address.city,
          customer_address: address.address,
          total_amount: totalAmount,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast({
          title: "Order failed",
          description: errorData.message || "Could not place order",
          variant: "destructive",
        });
        return;
      }

      const orderData = await res.json();
      clearCart();
      toast({
        title: "✅ Order placed!",
        description: `Order created successfully.`,
      });

      setShowAddressModal(false);
      setAddress({
        name: "",
        phone: "",
        pincode: "",
        city: "",
        address: "",
      });
      setSearchParams({ tab: "orders" });
      fetchOrders();
    } catch (error) {
      console.error("Order failed:", error);
      toast({
        title: "Error",
        description: "Could not place order.",
        variant: "destructive",
      });
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    const ok = window.confirm("Are you sure you want to cancel this order?");
    if (!ok) return;
    try {
      const res = await fetch(`${API.ORDERS}/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Cannot cancel",
          description: data.message || "Failed to cancel order",
          variant: "destructive",
        });
        return;
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveOrder = async (orderId: number) => {
    const ok = window.confirm("Remove this order permanently?");
    if (!ok) return;
    try {
      const res = await fetch(`${API.ORDERS}/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Cannot remove",
          description: data.message || "Failed to remove order",
          variant: "destructive",
        });
        return;
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast({
        title: "Order removed",
        description: "Order has been permanently removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove order.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Please log in to view your cart and orders.
        </p>
      </div>
    );
  }

  return (
    <>
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                📍 Delivery Address
              </h2>
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setAddress({
                    name: "",
                    phone: "",
                    pincode: "",
                    city: "",
                    address: "",
                  });
                }}
                className="text-xl hover:text-destructive text-muted-foreground p-1 -m-1"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Full Name
                </label>
                <Input
                  value={address.name}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nandini Rahane"
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={address.phone}
                  maxLength={10}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  placeholder="9322291932"
                  className={`h-11 ${
                    !isPhoneValid && address.phone
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                />
                {!isPhoneValid && address.phone && (
                  <p className="text-xs text-destructive mt-1">
                    Phone must be 10 digits
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Pincode
                  </label>
                  <Input
                    value={address.pincode}
                    maxLength={6}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        pincode: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="411030"
                    className={`h-11 ${
                      !isPincodeValid && address.pincode
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }`}
                  />
                  {!isPincodeValid && address.pincode && (
                    <p className="text-xs text-destructive mt-1">
                      Pincode must be 6 digits
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    City
                  </label>
                  <Input
                    value={address.city}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="Pune"
                    className="h-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Complete Address
                </label>
                <textarea
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-vertical h-24 min-h-[100px]"
                  rows={3}
                  value={address.address}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Flat 101, Sunshine Apartments, Baner, Landmark: Near McDonalds..."
                  autoComplete="street-address"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleConfirmOrder}
                  disabled={!isFormValid}
                  size="lg"
                  className="flex-1 h-11 text-base font-semibold"
                >
                  Confirm COD (₹{totalAmount.toFixed(2)})
                </Button>
                <Button
                  onClick={() => {
                    setShowAddressModal(false);
                    setAddress({
                      name: "",
                      phone: "",
                      pincode: "",
                      city: "",
                      address: "",
                    });
                  }}
                  variant="outline"
                  size="lg"
                  className="flex-1 h-11 text-base font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
            <p className="text-muted-foreground">
              Manage your cart and track your purchases
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setSearchParams({ tab: v })}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="cart">Cart</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="cart">
              <Card>
                <CardHeader>
                  <CardTitle>Your Cart</CardTitle>
                  <CardDescription>
                    Review items before placing your order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Your cart is empty.
                    </p>
                  ) : (
                    <>
                      {items.map((item) => (
                        <div
                          key={`${item.type}-${item.productId}`}
                          className="flex justify-between items-center border border-border rounded-lg p-3"
                        >
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{item.price} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.productId,
                                  item.type,
                                  Math.max(1, Number(e.target.value) || 1)
                                )
                              }
                              className="w-16 text-xs h-9"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeItem(item.productId, item.type)
                              }
                              className="h-9 px-3 text-xs"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <p className="font-semibold text-xl">
                          Total: ₹{totalAmount.toFixed(2)}
                        </p>
                        <Button
                          onClick={handlePlaceOrder}
                          size="lg"
                          className="w-40 h-11 bg-green-600 hover:bg-green-700"
                        >
                          Place COD Order
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

<TabsContent value="orders">
  <Card>
    <CardHeader className="py-3">
      <CardTitle className="text-xl">My Orders</CardTitle>
      <CardDescription>Your order history</CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      {orders.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          <p className="text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {orders.map((order: any) => (
            <div key={order.id} className="border border-border rounded-md p-4 space-y-2 bg-background hover:shadow-sm transition-all">
              {/* Products - Compact list */}
              <div className="space-y-1 max-h-20 overflow-hidden text-xs">
  <div className="grid grid-cols-3 gap-2 mb-1">
    {(order.order_items || []).slice(0, 3).map((item: any, index: number) => (
      <div key={index} className="flex items-start gap-1">
        <span className="truncate font-medium text-[11px] leading-tight">
          {item.product_name}
        </span>
        <span className="text-[10px] text-muted-foreground shrink-0 -mt-0.5">
          ×{item.quantity}
        </span>
      </div>
    ))}
  </div>
  {(order.order_items || []).length > 3 && (
    <div className="text-[10px] text-muted-foreground text-center py-1 px-2 bg-muted/50 rounded-sm">
      +{(order.order_items || []).length - 3} more
    </div>
  )}
</div>

              {/* Total */}
              <div className="font-semibold text-lg">₹{order.total_amount}</div>

              {/* Status Badge - YOUR exact style */}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : order.status === "paid" || order.status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.status}
                </span>

                {/* Buttons - YOUR exact logic */}
                {order.status === "pending" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-20 h-7 text-xs px-2"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel
                  </Button>
                ) : order.status === "cancelled" ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-20 h-7 text-xs px-2"
                    onClick={() => handleRemoveOrder(order.id)}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Orders;
