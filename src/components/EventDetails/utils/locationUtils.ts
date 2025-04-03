
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

// Sample address data
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

export const matchRealAddresses = (query: string): LocationResult[] => {
  return realAddresses.filter((address) => {
    const fullAddressLower = `${address.streetNumber} ${address.street} ${address.city} ${address.state} ${address.zip}`.toLowerCase();
    const streetAddressLower = `${address.streetNumber} ${address.street}`.toLowerCase();
    
    if (query.includes('1002') && query.includes('farm') && query.includes('lane')) {
      return true;
    }
    
    const allPartsMatch = query.split(' ').every(part => fullAddressLower.includes(part));
    const isStreetMatch = streetAddressLower.includes(query) || query.split(' ').every(part => streetAddressLower.includes(part));
    
    return allPartsMatch || isStreetMatch;
  }).map((address, index) => ({
    id: `real-${index}`,
    name: `${address.streetNumber} ${address.street}`,
    address: `${address.streetNumber} ${address.street}, ${address.city}, ${address.state} ${address.zip}`,
    placeId: `place_real_${index}`
  }));
};

export const generateAddressSuggestions = (query: string): LocationResult[] => {
  const results: LocationResult[] = [];
  const streetTypes = ["Street", "Avenue", "Boulevard", "Road", "Drive"];
  const cities = ["West Chester", "Philadelphia", "New York", "Boston", "Chicago"];
  const states = ["PA", "NY", "MA", "IL"];

  const queryParts = query.split(' ');
  const possibleNumber = queryParts[0];
  const hasNumber = /^\d+$/.test(possibleNumber);
  
  for (let i = 0; i < 3; i++) {
    const num = hasNumber ? possibleNumber : Math.floor(Math.random() * 1000) + 1;
    
    let street;
    if (hasNumber && queryParts.length > 1) {
      street = queryParts.slice(1).join(' ');
      street = street.charAt(0).toUpperCase() + street.slice(1);
    } else {
      street = query.charAt(0).toUpperCase() + query.slice(1);
    }
    
    const streetType = streetTypes[i % streetTypes.length];
    const city = cities[i % cities.length];
    const state = states[i % states.length];
    const zip = Math.floor(Math.random() * 90000) + 10000;
    
    results.push({
      id: `mock-${i}`,
      name: `${num} ${street} ${streetType}`,
      address: `${num} ${street} ${streetType}, ${city}, ${state} ${zip}`,
      placeId: `place_${i}`
    });
  }
  
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
