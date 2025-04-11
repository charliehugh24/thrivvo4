
import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { LocationResult } from './utils/locationUtils';

interface LocationResultsListProps {
  isSearching: boolean;
  locationResults: LocationResult[];
  handleLocationSelect: (location: LocationResult) => void;
  resultsContainerRef: React.RefObject<HTMLDivElement>;
}

const LocationResultsList: React.FC<LocationResultsListProps> = ({
  isSearching,
  locationResults,
  handleLocationSelect,
  resultsContainerRef,
}) => {
  if (!locationResults.length && !isSearching) {
    return (
      <div 
        ref={resultsContainerRef}
        className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md"
      >
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">No locations found</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={resultsContainerRef}
      className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md"
    >
      {isSearching ? (
        <div className="p-4 text-center">
          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Searching locations...</p>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto">
          {locationResults.map(location => (
            <div 
              key={location.id} 
              onClick={() => handleLocationSelect(location)} 
              className="relative flex cursor-pointer select-none items-center px-4 py-3 text-sm outline-none hover:bg-muted/50 border-b last:border-b-0"
            >
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate">{location.name}</span>
                {location.id !== 'custom' && (
                  <span className="text-xs text-muted-foreground truncate">{location.address}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationResultsList;
