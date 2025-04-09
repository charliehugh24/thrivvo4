
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PartyEvents from "./pages/PartyEvents";
import HouseParties from "./pages/HouseParties";
import EventDetail from "./pages/EventDetail";
import Search from "./pages/Search";
import AddEvent from "./pages/AddEvent";
import EventNameStep from "./pages/EventNameStep";
import EventDetailsStep from "./pages/EventDetailsStep";
import EventPhotosStep from "./pages/EventPhotosStep";
import EventReviewStep from "./pages/EventReviewStep";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/party-events" element={<PartyEvents />} />
          <Route path="/house-parties" element={<HouseParties />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/add-event/name" element={<EventNameStep />} />
          <Route path="/add-event/details" element={<EventDetailsStep />} />
          <Route path="/add-event/photos" element={<EventPhotosStep />} />
          <Route path="/add-event/review" element={<EventReviewStep />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subscription" element={<Subscription />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
