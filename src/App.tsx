import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { forwardRef } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnchainProvider } from "@/providers/OnchainProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Browse from "./pages/Browse";
import SubmitFilm from "./pages/SubmitFilm";
import DistributorApply from "./pages/DistributorApply";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = forwardRef((_, _ref) => (
  <QueryClientProvider client={queryClient}>
    <OnchainProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/submit-film" element={<SubmitFilm />} />
              <Route path="/distributor-apply" element={<DistributorApply />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </OnchainProvider>
  </QueryClientProvider>
));

App.displayName = "App";

export default App;

