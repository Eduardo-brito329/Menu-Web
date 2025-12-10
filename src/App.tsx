import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminSettings from "./pages/AdminSettings";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";
import { ProtectedWrapper } from "@/components/ProtectedWrapper";
import Bloqueado from "./pages/Bloqueado";
import Signatures from "@/pages/Signatures";
import MenuRouteWrapper from "./pages/MenuRouteWrapper";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedWrapper>
                  <Admin />
                </ProtectedWrapper>
              }
            />
            <Route path="/admin/produtos" element={
              <ProtectedWrapper>
                <AdminProducts />
              </ProtectedWrapper>
            } />

            <Route path="/admin/configuracoes" element={
              <ProtectedWrapper>
                <AdminSettings />
              </ProtectedWrapper>
            } />
            <Route path="/admin/assinatura" element={<Signatures />} />
            <Route path="/menu/:storeId" element={<MenuRouteWrapper />} />
            <Route path="/bloqueado" element={<Bloqueado />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
