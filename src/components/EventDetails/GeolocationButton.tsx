
import React from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GeolocationButtonProps {
  isLocating: boolean;
  setIsLocating: React.Dispatch<React.SetStateAction<boolean>>;
  onLocationDetected: (address: string) => void;
}

const GeolocationButton: React.FC<GeolocationButtonProps> = ({
  isLocating,
  setIsLocating,
  onLocationDetected
}) => {
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
      try {
        const { latitude, longitude } = position.coords;

        await new Promise(resolve => setTimeout(resolve, 800));

        const mockAddress = "1002 Farm Lane, West Chester, PA 19383";
        onLocationDetected(mockAddress);
        
        toast({
          title: "Location detected",
          description: "Your current location has been set"
        });
      } catch (error) {
        toast({
          title: "Location error",
          description: "Could not determine your location",
          variant: "destructive"
        });
      } finally {
        setIsLocating(false);
      }
    }, error => {
      console.error("Geolocation error:", error);
      let errorMessage = "Could not determine your location";
      if (error.code === 1) {
        errorMessage = "Location permission denied";
      }
      toast({
        title: "Location error",
        description: errorMessage,
        variant: "destructive"
      });
      setIsLocating(false);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  };

  return (
    <Button 
      type="button" 
      variant="ghost" 
      size="icon" 
      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8" 
      onClick={getCurrentLocation} 
      disabled={isLocating}
    >
      {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
    </Button>
  );
};

export default GeolocationButton;
