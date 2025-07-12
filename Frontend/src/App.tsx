import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ListItem from "./pages/ListItem";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";
import AdminPanel from "./pages/AdminPanel";
import ItemDetail from "./pages/ItemDetail";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import HowItWorks from "./pages/HowItWorks";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

function AppRoutesWithFooter() {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/list-item" element={<ListItem />} />
        <Route path="/community" element={<Community />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {location.pathname !== '/' && <Footer />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutesWithFooter />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
