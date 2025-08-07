import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Illustrazioni from "./pages/Illustrazioni";
import Portachiavi from "./pages/Portachiavi";
import Commissioni from "./pages/Commissioni";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import AboutMe from "./components/AboutMe";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <Navigation/>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/illustrazioni" element={<Illustrazioni />} />
          <Route path="/portachiavi" element={<Portachiavi />} />
          <Route path="/commissioni" element={<Commissioni />} />
          <Route path="/aboutme" element={<AboutMe />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
