export type EventCategory = 'party' | 'club' | 'bar' | 'concert' | 'game-night' | 'food' | 'fitness' | 'networking' | 'outdoor' | 'sports' | 'other';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  location: {
    name: string;
    address: string;
    distance: number;
  };
  time: {
    start: string;
    end: string | null;
  };
  host: {
    id: string;
    name: string;
    verified: boolean;
    avatar: string | null;
  };
  attendees: {
    count: number;
    max: number | null;
    ids: string[];
  };
  price: {
    amount: number;
    currency: string;
  } | null;
  images: string[];
  vibe: string[];
  monetized: boolean;
  isVerified: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Add a Profile interface that matches the Supabase profiles table structure
export interface Profile {
  id: string;
  user_id: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}
