
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
  placeId?: string;
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
        // Simulate Google Maps Geocoding API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate realistic-looking address suggestions based on input
        const query = eventData.location.toLowerCase();
        
        // Mock realistic address results
        const mockResults: LocationResult[] = [];
        
        // Add some standard address types based on the query
        if (query.length > 1) {
          const streetTypes = ['Street', 'Avenue', 'Boulevard', 'Road', 'Lane', 'Drive'];
          const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
          const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'];
          
          // Generate various address suggestions
          for (let i = 0; i < 5; i++) {
            const streetType = streetTypes[i % streetTypes.length];
            const city = cities[i % cities.length];
            const state = states[i % states.length];
            const streetNumber = Math.floor(Math.random() * 1000) + 1;
            
            mockResults.push({
              id: `${i}`,
              name: `${query.charAt(0).toUpperCase() + query.slice(1)} ${streetType}`,
              address: `${streetNumber} ${query.charAt(0).toUpperCase() + query.slice(1)} ${streetType}, ${city}, ${state}`,
              placeId: `place_${Math.random().toString(36).substring(2, 10)}`
            });
          }
          
          // Also add some landmarks or places
          if (query.length > 2) {
            mockResults.push({
              id: '5',
              name: `${query.charAt(0).toUpperCase() + query.slice(1)} Mall`,
              address: `${query.charAt(0).toUpperCase() + query.slice(1)} Mall, 1000 Shopping Center Dr, Boston, MA`,
              placeId: `place_${Math.random().toString(36).substring(2, 10)}`
            });
            
            mockResults.push({
              id: '6',
              name: `${query.charAt(0).toUpperCase() + query.slice(1)} Park`,
              address: `${query.charAt(0).toUpperCase() + query.slice(1)} Park, 200 Park Ave, San Francisco, CA`,
              placeId: `place_${Math.random().toString(36).substring(2, 10)}`
            });
          }
        }
        
        // Allow any full address to be entered by adding it as an option
        if (query.includes(' ') || query.length > 10) {
          // This enables users to manually type a complete address
          mockResults.unshift({
            id: 'custom',
            name: `Use "${eventData.location}"`,
            address: eventData.location,
            placeId: `custom_${Math.random().toString(36).substring(2, 10)}`
          });
        }
        
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
          
          // Mock realistic reverse geocoded address
          const mockAddress = `${Math.floor(Math.random() * 1000) + 1} Main Street, ${
            ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]
          }, ${
            ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)]
          } ${Math.floor(Math.random() * 90000) + 10000}`;
          
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
                    placeholder="Type your address or location name" 
                    value={eventData.location}
                    className="pl-9 pr-10"
                    onChange={(e) => handleChange('location', e.target.value)}
                    onFocus={() => eventData.location.length > 1 && setOpen(true)}
                    onKeyUp={() => eventData.location.length > 1 ? setOpen(true) : setOpen(false)}
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
                            <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-medium truncate">{location.name}</span>
                              <span className="text-xs text-muted-foreground truncate">{location.address}</span>
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
                        <p className="text-sm text-muted-foreground">Type your address to search for locations</p>
                      </div>
                    )}
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Enter a full address or use your current location
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
