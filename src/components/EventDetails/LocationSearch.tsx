
import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import LocationResultsList from './LocationResultsList';
import GeolocationButton from './GeolocationButton';
import { 
  LocationResult,
  matchCitiesAndTowns,
  generateAddressSuggestions,
  createExactAddressOption
} from './utils/locationUtils';

interface LocationSearchProps {
  location: string;
  onLocationChange: (location: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  location,
  onLocationChange
}) => {
  const [searchText, setSearchText] = useState(location || '');
  const [isSearching, setIsSearching] = useState(false);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const query = searchText.toLowerCase();
        
        // Create the "use exactly what I typed" option
        const exactAddressOption = createExactAddressOption(searchText);
        
        // Match against cities and towns first
        const matchedCities = matchCitiesAndTowns(query);
        
        let results: LocationResult[];
        if (matchedCities.length > 0) {
          results = [exactAddressOption, ...matchedCities];
        } else {
          results = [exactAddressOption, ...generateAddressSuggestions(query)];
        }

        setLocationResults(results);
        if (results.length > 0) {
          setShowResults(true);
        }
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

  const handleLocationSelect = (location: LocationResult) => {
    onLocationChange(location.address);
    setSearchText(location.address);
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onLocationChange(value);
    
    if (value.trim().length > 1) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleGeolocationSuccess = (address: string) => {
    onLocationChange(address);
    setSearchText(address);
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsContainerRef.current && 
        !resultsContainerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Location</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          ref={inputRef}
          placeholder="Enter a city or town" 
          value={searchText} 
          className="pl-9 pr-10" 
          onChange={handleInputChange}
          onFocus={() => {
            if (searchText.trim().length > 1 && locationResults.length > 0) {
              setShowResults(true);
            }
          }}
          onClick={() => {
            if (searchText.trim().length > 1 && locationResults.length > 0) {
              setShowResults(true);
            }
          }}
        />
        
        <GeolocationButton 
          isLocating={isLocating} 
          setIsLocating={setIsLocating}
          onLocationDetected={handleGeolocationSuccess}
        />
        
        {showResults && (
          <LocationResultsList 
            isSearching={isSearching}
            locationResults={locationResults}
            handleLocationSelect={handleLocationSelect}
            resultsContainerRef={resultsContainerRef}
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Enter a city or town, or use your current location
      </p>
    </div>
  );
};

export default LocationSearch;
