interface Address {
  streetNumber: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface LocationResult {
  id: string;
  name: string;
  address: string;
  placeId?: string;
}

// Sample cities and towns data
export const cities = [
  { city: 'West Chester', state: 'PA' },
  { city: 'Philadelphia', state: 'PA' },
  { city: 'New York', state: 'NY' },
  { city: 'Boston', state: 'MA' },
  { city: 'Chicago', state: 'IL' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Miami', state: 'FL' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Denver', state: 'CO' },
  { city: 'Austin', state: 'TX' },
  { city: 'Portland', state: 'OR' },
  { city: 'Washington', state: 'DC' },
  { city: 'Nashville', state: 'TN' },
  { city: 'Atlanta', state: 'GA' }
];

// Sample address data - keeping for reference but not using for location suggestions
export const realAddresses: Address[] = [
  {
    streetNumber: '1002',
    street: 'Farm Lane',
    city: 'West Chester',
    state: 'PA',
    zip: '19383',
  },
  {
    streetNumber: '1600',
    street: 'Pennsylvania Ave',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
  },
  {
    streetNumber: '350',
    street: 'Fifth Ave',
    city: 'New York',
    state: 'NY',
    zip: '10118',
  },
  {
    streetNumber: '151',
    street: 'W 34th St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
  },
  {
    streetNumber: '1',
    street: 'Market Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
  },
  {
    streetNumber: '233',
    street: 'S Wacker Dr',
    city: 'Chicago',
    state: 'IL',
    zip: '60606',
  },
  {
    streetNumber: '400',
    street: 'Broad St',
    city: 'Philadelphia',
    state: 'PA',
    zip: '19102',
  }
];

export const matchCitiesAndTowns = (query: string): LocationResult[] => {
  return cities.filter((location) => {
    const locationString = `${location.city} ${location.state}`.toLowerCase();
    return locationString.includes(query.toLowerCase());
  }).map((location, index) => ({
    id: `city-${index}`,
    name: location.city,
    address: `${location.city}, ${location.state}`,
    placeId: `place_city_${index}`
  }));
};

export const matchRealAddresses = (query: string): LocationResult[] => {
  return [];
};

export const generateAddressSuggestions = (query: string): LocationResult[] => {
  const results: LocationResult[] = [];
  
  const towns = [
    { city: `${query.charAt(0).toUpperCase() + query.slice(1)}ville`, state: 'PA' },
    { city: `${query.charAt(0).toUpperCase() + query.slice(1)} Springs`, state: 'CO' },
    { city: `${query.charAt(0).toUpperCase() + query.slice(1)}town`, state: 'NY' }
  ];
  
  towns.forEach((town, i) => {
    results.push({
      id: `gen-town-${i}`,
      name: town.city,
      address: `${town.city}, ${town.state}`,
      placeId: `place_gen_${i}`
    });
  });
  
  return results;
};

export const createExactAddressOption = (searchText: string): LocationResult => {
  return {
    id: 'custom',
    name: `Use "${searchText}"`,
    address: searchText,
    placeId: `custom_${Math.random().toString(36).substring(2, 10)}`
  };
};
