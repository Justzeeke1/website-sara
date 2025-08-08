import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Illustrazioni from "./pages/Illustrazioni";
import Portachiavi from "./pages/Portachiavi";
import Commissioni from "./pages/Commissioni";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import AboutMe from "./components/AboutMe";
import { ScrollToTop } from "./lib/utils";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navigation/>
        <main className="pt-16 h-[calc(100vh-4rem)] overflow-y-auto" role="main">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/illustrazioni" element={<Illustrazioni />} />
            <Route path="/portachiavi" element={<Portachiavi />} />
            <Route path="/commissioni" element={<Commissioni />} />
            <Route path="/aboutme" element={<AboutMe />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
