
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import ForgotPassword from "./pages/ForgotPassword";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/party-events" element={<ProtectedRoute><PartyEvents /></ProtectedRoute>} />
      <Route path="/house-parties" element={<ProtectedRoute><HouseParties /></ProtectedRoute>} />
      <Route path="/event/:eventId" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
      <Route path="/add-event" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
      <Route path="/add-event/name" element={<ProtectedRoute><EventNameStep /></ProtectedRoute>} />
      <Route path="/add-event/photos" element={<ProtectedRoute><EventPhotosStep /></ProtectedRoute>} />
      <Route path="/add-event/details" element={<ProtectedRoute><EventDetailsStep /></ProtectedRoute>} />
      <Route path="/add-event/review" element={<ProtectedRoute><EventReviewStep /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
