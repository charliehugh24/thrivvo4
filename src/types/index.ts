
export type EventCategory = 
  | 'party' 
  | 'club' 
  | 'bar' 
  | 'concert' 
  | 'game-night' 
  | 'food' 
  | 'fitness' 
  | 'networking' 
  | 'outdoor' 
  | 'sports'  // Added new "sports" category
  | 'other';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  location: {
    name: string;
    address: string;
    distance: number; // in miles or kilometers
  };
  time: {
    start: string; // ISO string
    end?: string; // ISO string, optional for events without specific end time
  };
  host: {
    id: string;
    name: string;
    verified: boolean;
    avatar?: string;
  };
  attendees: {
    count: number;
    max?: number; // Optional, for events with limited spots
  };
  price?: {
    amount: number;
    currency: string;
  };
  images: string[];
  vibe: string[];
  isPrivate: boolean;
  isVerified?: boolean; // New field for event verification
  monetized?: boolean; // New field to explicitly track if the event is monetized
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  interests: EventCategory[];
  status: 'available' | 'busy' | 'offline';
  location?: {
    lat: number;
    lng: number;
  };
  distance?: number; // calculated on the fly based on current location
}
