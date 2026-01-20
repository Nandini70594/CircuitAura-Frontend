// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import ScrollToTop from "@/components/ScrollToTop";
// import { ThemeProvider } from "./contexts/ThemeContext";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import { CartProvider } from "./contexts/CartContext";
// import { Header } from "./components/Header";
// import { Footer } from "./components/Footer";
// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import ProductDetail from "./pages/ProductDetail";
// import Kits from "./pages/Kits";
// import KitDetail from "./pages/KitDetail";
// import Learning from "./pages/Learning";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import Orders from "./pages/Orders";
// import AdminDashboard from "./pages/AdminDashboard";
// import { ResetPassword } from "./pages/ResetPassword";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const AppRoutes = ({ openAuth }: { openAuth: (tab: 'login' | 'signup') => void }) => {
//   const { loading, isAuthenticated, user } = useAuth();

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }

//   const isAdminUser = user?.role === 'admin';

//   return (
//     <>
//       <Header openAuth={openAuth} />
//       <main className="flex-1">
//         <Routes>
//           <Route path="/" element={<Home openAuth={openAuth} />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/products/:id" element={<ProductDetail />} />
//           <Route path="/kits" element={<Kits />} />
//           <Route path="/kits/:id" element={<KitDetail />} />
//           <Route path="/learning" element={<Learning />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
          
//           <Route path="/orders" element={
//             isAuthenticated ? <Orders /> : <Navigate to="/" />
//           } />
          
//           <Route path="/admin-dashboard" element={
//             isAuthenticated && isAdminUser ? <AdminDashboard /> : <Navigate to="/" />
//           } />
          
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </main>
//       <Footer />
//     </>
//   );
// };

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <ThemeProvider>
//         <AuthProvider>
//           <CartProvider>
//             <TooltipProvider>
//               <BrowserRouter>
//                 <ScrollToTop />
//                 <AppRoutes openAuth={() => {}} />
//                 <Toaster />
//                 <Sonner />
//               </BrowserRouter>
//             </TooltipProvider>
//           </CartProvider>
//         </AuthProvider>
//       </ThemeProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";  
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";  // ✅ LINE 1: ADD THIS
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Kits from "./pages/Kits";
import KitDetail from "./pages/KitDetail";
import Learning from "./pages/Learning";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import { ResetPassword } from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = ({ openAuth }: { openAuth: (tab: 'login' | 'signup') => void }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const isAdminUser = user?.role === 'admin';

  return (
    <>
      <Header openAuth={openAuth} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home openAuth={openAuth} />} />
          <Route path="/products" element={<Products openAuth={openAuth} />} />
          <Route path="/products/:id" element={<ProductDetail openAuth={openAuth} />} />        
          <Route path="/kits" element={<Kits openAuth={openAuth} />} />
          <Route path="/kits/:id" element={<KitDetail openAuth={openAuth} />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/orders" element={
            isAuthenticated ? <Orders /> : <Navigate to="/" />
          } />
          
          <Route path="/admin-dashboard" element={
            isAuthenticated && isAdminUser ? <AdminDashboard /> : <Navigate to="/" />
          } />
          
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');

  // ✅ FIXED: Clean function - NO global hack
  const openAuth = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <BrowserRouter>
                <ScrollToTop />
                {/* ✅ PASS THE CLEAN FUNCTION */}
                <AppRoutes openAuth={openAuth} />
                
                {/* ✅ MODAL - already perfect */}
                <AuthModal 
                  open={isAuthOpen}
                  onOpenChange={setIsAuthOpen}
                  defaultTab={authTab}
                />
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
