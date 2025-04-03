
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Navigation, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Interface for location search results
interface LocationResult {
  id: string;
  name: string;
  address: string;
}

const EventDetailsStep = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    type: '',
    name: '',
    description: '',
    location: '',
    date: ''
  });
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Load saved data from session storage
    const savedData = sessionStorage.getItem('newEventData');
    if (savedData) {
      setEventData(prevData => ({
        ...prevData,
        ...JSON.parse(savedData)
      }));
    } else {
      // If no data, go back to the start
      navigate('/add-event');
    }
  }, [navigate]);

  useEffect(() => {
    // Search for locations when input changes
    const searchLocations = async () => {
      if (!eventData.location || eventData.location.trim().length < 2) {
        setLocationResults([]);
        return;
      }

      setIsSearching(true);

      try {
        // Simulate API call with a timeout
        // In production, replace this with actual geocoding API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock location results based on input
        const query = eventData.location.toLowerCase();
        const mockResults: LocationResult[] = [
          {
            id: '1',
            name: `${eventData.location} City Center`,
            address: `123 Main St, ${eventData.location}, CA`
          },
          {
            id: '2',
            name: `${eventData.location} Convention Center`,
            address: `456 Convention Ave, ${eventData.location}, CA`
          },
          {
            id: '3',
            name: `${eventData.location} Downtown`,
            address: `789 Downtown Blvd, ${eventData.location}, CA`
          },
          {
            id: '4',
            name: `${eventData.location} Park`,
            address: `101 Park Road, ${eventData.location}, CA`
          },
          {
            id: '5',
            name: `${eventData.location} Hotel`,
            address: `202 Hotel Way, ${eventData.location}, CA`
          }
        ];
        
        setLocationResults(mockResults);
      } catch (error) {
        console.error("Error searching for locations:", error);
        toast({
          title: "Search error",
          description: "Could not search for locations",
          variant: "destructive",
        });
        setLocationResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search to prevent too many requests
    const timer = setTimeout(() => {
      searchLocations();
    }, 300);

    return () => clearTimeout(timer);
  }, [eventData.location, toast]);

  const handleBack = () => {
    navigate(`/add-event/name?type=${eventData.type}`);
  };

  const handleNext = () => {
    // Validate required fields
    if (!eventData.description || !eventData.location || !eventData.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }

    // Save the updated data
    sessionStorage.setItem('newEventData', JSON.stringify(eventData));
    
    // Go to the photos step
    navigate('/add-event/photos');
  };

  const handleChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: LocationResult) => {
    setEventData(prev => ({ ...prev, location: location.address }));
    setOpen(false);
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // In a real app, this would call a reverse geocoding API
          // For now, we'll just set coordinates
          const { latitude, longitude } = position.coords;
          
          // Simulate a reverse geocoding API call
          await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
          
          // Mock address based on coordinates
          const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Your current location)`;
          
          // Set the location in state
          setEventData(prev => ({ ...prev, location: mockAddress }));
          
          toast({
            title: "Location detected",
            description: "Your current location has been set",
          });
        } catch (error) {
          toast({
            title: "Location error",
            description: "Could not determine your location",
            variant: "destructive",
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Could not determine your location";
        if (error.code === 1) {
          errorMessage = "Location permission denied";
        }
        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Render only the basic location search UI - we'll use simple divs instead of Command component
  // This removes the dependency on the cmdk component that's causing issues
  return (
    <AppLayout activeTab="add">
      <div className="p-4 space-y-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Event Details</h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <Textarea 
              placeholder="Describe your event" 
              rows={4}
              value={eventData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Location</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Type to search location" 
                    value={eventData.location}
                    className="pl-9 pr-10"
                    onChange={(e) => handleChange('location', e.target.value)}
                    onFocus={() => setOpen(true)}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Searching locations...</p>
                  </div>
                ) : (
                  <div className="overflow-hidden bg-popover rounded-md">
                    {locationResults && locationResults.length > 0 ? (
                      <div className="p-1">
                        {locationResults.map((location) => (
                          <div
                            key={location.id}
                            onClick={() => handleLocationSelect(location)}
                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            <div className="flex flex-col">
                              <span className="font-medium">{location.name}</span>
                              <span className="text-xs text-muted-foreground">{location.address}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : eventData.location.trim().length > 0 ? (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">No locations found</p>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Start typing to search for locations</p>
                      </div>
                    )}
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Enter an address or use your current location
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Date & Time</label>
            <Input 
              type="datetime-local" 
              value={eventData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleNext} className="w-full">
              Continue to Photos
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventDetailsStep;
