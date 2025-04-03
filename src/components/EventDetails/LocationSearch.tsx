import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
interface LocationResult {
  id: string;
  name: string;
  address: string;
  placeId?: string;
}
interface LocationSearchProps {
  location: string;
  onLocationChange: (location: string) => void;
}
const LocationSearch: React.FC<LocationSearchProps> = ({
  location,
  onLocationChange
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState(location || '');
  const [isSearching, setIsSearching] = useState(false);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const {
    toast
  } = useToast();

  // Update internal state when prop changes
  useEffect(() => {
    setSearchText(location);
  }, [location]);
  useEffect(() => {
    const searchLocations = async () => {
      if (!searchText || searchText.trim().length < 2) {
        setLocationResults([]);
        return;
      }
      setIsSearching(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        const query = searchText.toLowerCase();

        // Add exact address option as first option
        const exactAddressOption: LocationResult = {
          id: 'custom',
          name: `Use "${searchText}"`,
          address: searchText,
          placeId: `custom_${Math.random().toString(36).substring(2, 10)}`
        };

        // Generate mock results based on input
        let mockResults: LocationResult[] = [];

        // Add special case for West Chester Farm Lane address
        const isWestChesterFarmLane = query.includes('farm lane') && query.includes('west chester');
        if (isWestChesterFarmLane) {
          mockResults.push({
            id: 'exact-match',
            name: "1002 Farm Lane",
            address: "1002 Farm Lane, West Chester, PA 19383",
            placeId: `place_exact`
          });
        }

        // Add more mock results
        mockResults = mockResults.concat(generateMockAddresses(query));

        // Always add exact address as first option
        mockResults = [exactAddressOption, ...mockResults];
        setLocationResults(mockResults);
        setIsSearchOpen(true);
      } catch (error) {
        console.error("Error searching for locations:", error);
        toast({
          title: "Search error",
          description: "Could not search for locations",
          variant: "destructive"
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
  }, [searchText, toast]);

  // Simple function to generate mock addresses based on input
  const generateMockAddresses = (query: string): LocationResult[] => {
    const results: LocationResult[] = [];
    const streetTypes = ["Street", "Avenue", "Boulevard", "Road", "Drive"];
    const cities = ["West Chester", "Philadelphia", "New York", "Boston", "Chicago"];
    const states = ["PA", "NY", "MA", "IL"];

    // Generate a few mock addresses
    for (let i = 0; i < 4; i++) {
      const num = Math.floor(Math.random() * 1000) + 1;
      const street = query.charAt(0).toUpperCase() + query.slice(1);
      const streetType = streetTypes[i % streetTypes.length];
      const city = cities[i % cities.length];
      const state = states[i % states.length];
      const zip = Math.floor(Math.random() * 90000) + 10000;
      results.push({
        id: `mock-${i}`,
        name: `${street} ${streetType}`,
        address: `${num} ${street} ${streetType}, ${city}, ${state} ${zip}`,
        placeId: `place_${i}`
      });
    }
    return results;
  };
  const handleLocationSelect = (location: LocationResult) => {
    onLocationChange(location.address);
    setSearchText(location.address);
    setIsSearchOpen(false);
  };
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
        const {
          latitude,
          longitude
        } = position.coords;

        // Simulate reverse geocoding delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // For demo purposes, use a fixed address
        const mockAddress = "1002 Farm Lane, West Chester, PA 19383";
        onLocationChange(mockAddress);
        setSearchText(mockAddress);
        setIsSearchOpen(false);
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
  return <div className="space-y-2">
      <label className="block text-sm font-medium">Location</label>
      <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Enter any address worldwide" value={searchText} className="pl-9 pr-10" onChange={e => {
            setSearchText(e.target.value);
            if (e.target.value.trim() === '') {
              onLocationChange('');
            }
          }} onClick={() => {
            if (searchText && locationResults.length > 0) {
              setIsSearchOpen(true);
            }
          }} />
            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8" onClick={getCurrentLocation} disabled={isLocating}>
              {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[calc(100vw-2rem)] max-w-lg" align="start">
          {isSearching ? <div className="p-4 text-center">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Searching locations worldwide...</p>
            </div> : <div className="max-h-[300px] overflow-y-auto">
              {locationResults && locationResults.length > 0 ? locationResults.map(location => <div key={location.id} onClick={() => handleLocationSelect(location)} className="relative flex cursor-pointer select-none items-center px-4 py-3 text-sm outline-none hover:bg-muted/50 border-b last:border-b-0 ">
                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium truncate">{location.name}</span>
                      <span className="text-xs text-muted-foreground truncate">{location.address}</span>
                    </div>
                  </div>) : <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No locations found</p>
                </div>}
            </div>}
        </PopoverContent>
      </Popover>
      <p className="text-xs text-muted-foreground">
        Enter any address worldwide or use your current location
      </p>
    </div>;
};
export default LocationSearch;