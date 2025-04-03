
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Navigation, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    const savedData = sessionStorage.getItem('newEventData');
    if (savedData) {
      setEventData(prevData => ({
        ...prevData,
        ...JSON.parse(savedData)
      }));
    } else {
      navigate('/add-event');
    }
  }, [navigate]);

  useEffect(() => {
    const searchLocations = async () => {
      // Only search if there's input and the field is focused
      if (!eventData.location || eventData.location.trim().length < 2 || !inputFocused) {
        if (!inputFocused) setIsSearchOpen(false);
        return;
      }

      setIsSearching(true);
      setIsSearchOpen(true);

      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const query = eventData.location.toLowerCase();
        
        // Generate realistic location suggestions based on input
        const mockResults: LocationResult[] = generateWorldwideAddresses(query);
        
        // Add "Use as entered" option for convenience
        if (query.length > 2) {
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

    const timer = setTimeout(() => {
      searchLocations();
    }, 300);

    return () => clearTimeout(timer);
  }, [eventData.location, toast, inputFocused]);

  // Generate worldwide address suggestions based on user input
  const generateWorldwideAddresses = (query: string): LocationResult[] => {
    const results: LocationResult[] = [];
    
    // Generate addresses in different formats for different regions
    // North America style
    results.push({
      id: `na-${Math.random().toString(36).substring(2, 10)}`,
      name: `${query.charAt(0).toUpperCase() + query.slice(1)} Street`,
      address: `123 ${query.charAt(0).toUpperCase() + query.slice(1)} St, New York, NY 10001, USA`,
      placeId: `place_${Math.random().toString(36).substring(2, 10)}`
    });
    
    // European style
    results.push({
      id: `eu-${Math.random().toString(36).substring(2, 10)}`,
      name: `${query.charAt(0).toUpperCase() + query.slice(1)}straße`,
      address: `${query.charAt(0).toUpperCase() + query.slice(1)}straße 42, 10115 Berlin, Germany`,
      placeId: `place_${Math.random().toString(36).substring(2, 10)}`
    });
    
    // UK style
    results.push({
      id: `uk-${Math.random().toString(36).substring(2, 10)}`,
      name: `${query.charAt(0).toUpperCase() + query.slice(1)} Road`,
      address: `45 ${query.charAt(0).toUpperCase() + query.slice(1)} Road, London SW1A 1AA, UK`,
      placeId: `place_${Math.random().toString(36).substring(2, 10)}`
    });
    
    // Asian style
    results.push({
      id: `as-${Math.random().toString(36).substring(2, 10)}`,
      name: `${query.charAt(0).toUpperCase() + query.slice(1)} Street`,
      address: `Block 123, ${query.charAt(0).toUpperCase() + query.slice(1)} Street, Tokyo 100-0001, Japan`,
      placeId: `place_${Math.random().toString(36).substring(2, 10)}`
    });
    
    // Latin American style
    results.push({
      id: `la-${Math.random().toString(36).substring(2, 10)}`,
      name: `Calle ${query.charAt(0).toUpperCase() + query.slice(1)}`,
      address: `Calle ${query.charAt(0).toUpperCase() + query.slice(1)} #123, Col. Centro, Mexico City 06000, Mexico`,
      placeId: `place_${Math.random().toString(36).substring(2, 10)}`
    });
    
    // African style
    results.push({
      id: `af-${Math.random().toString(36).substring(2, 10)}`,
      name: `${query.charAt(0).toUpperCase() + query.slice(1)} Avenue`,
      address: `${query.charAt(0).toUpperCase() + query.slice(1)} Avenue, Nairobi 00100, Kenya`,
      placeId: `place_${Math.random().toString(36).substring(2, 10)}`
    });
    
    // Add a POI (Point of Interest)
    results.push({
      id: `poi-${Math.random().toString(36).substring(2, 10)}`,
      name: `${query.charAt(0).toUpperCase() + query.slice(1)} Mall`,
      address: `${query.charAt(0).toUpperCase() + query.slice(1)} Shopping Center, 888 Market St, Sydney NSW 2000, Australia`,
      placeId: `place_${Math.random().toString(36).substring(2, 10)}`
    });
    
    return results;
  };

  const handleBack = () => {
    navigate(`/add-event/name?type=${eventData.type}`);
  };

  const handleNext = () => {
    if (!eventData.description || !eventData.location || !eventData.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }

    sessionStorage.setItem('newEventData', JSON.stringify(eventData));
    navigate('/add-event/photos');
  };

  const handleChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: LocationResult) => {
    setEventData(prev => ({ ...prev, location: location.address }));
    setIsSearchOpen(false);
    setInputFocused(false);
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
          const { latitude, longitude } = position.coords;
          
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Simulate reverse geocoding with worldwide addresses
          const countries = ['USA', 'UK', 'Germany', 'Japan', 'Australia', 'Brazil', 'Canada', 'India', 'South Africa'];
          const cities = ['New York', 'London', 'Berlin', 'Tokyo', 'Sydney', 'São Paulo', 'Toronto', 'Mumbai', 'Cape Town'];
          const streets = ['Main St', 'High Street', 'Hauptstraße', '中央通り', 'Market Street', 'Avenida Paulista', 'Queen Street', 'MG Road', 'Long Street'];
          
          const randomIndex = Math.floor(Math.random() * countries.length);
          const mockAddress = `${Math.floor(Math.random() * 1000) + 1} ${streets[randomIndex]}, ${
            cities[randomIndex]
          }, ${
            countries[randomIndex]
          } ${Math.floor(Math.random() * 90000) + 10000}`;
          
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
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Type any address worldwide" 
                value={eventData.location}
                className="pl-9 pr-10"
                onChange={(e) => {
                  handleChange('location', e.target.value);
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => {
                  // Small delay to allow click on suggestions
                  setTimeout(() => {
                    if (!document.activeElement?.closest('.location-results')) {
                      setInputFocused(false);
                    }
                  }, 200);
                }}
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
            
            {/* Location search results dropdown */}
            {isSearchOpen && eventData.location.length > 1 && (
              <div className="relative z-50 location-results">
                <div className="absolute w-full rounded-md border bg-popover shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                  <div className="overflow-hidden bg-popover rounded-md">
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Searching locations worldwide...</p>
                      </div>
                    ) : (
                      <div className="p-1 max-h-64 overflow-y-auto">
                        {locationResults && locationResults.length > 0 ? (
                          <div>
                            {locationResults.map((location) => (
                              <div
                                key={location.id}
                                onMouseDown={(e) => e.preventDefault()} // Prevent blur from canceling the click
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
                            <p className="text-sm text-muted-foreground">Type any address worldwide</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Enter any address worldwide or use your current location
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
