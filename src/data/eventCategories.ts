import { EventCategory } from '@/types';

export const eventCategories: { id: EventCategory; name: string; icon: string }[] = [
  { id: 'house-party', name: 'House Parties', icon: '🏠' },
  { id: 'club', name: 'Clubs', icon: '🪩' },
  { id: 'bar', name: 'Bars', icon: '🍻' },
  { id: 'concert', name: 'Concerts', icon: '🎵' },
  { id: 'game-night', name: 'Game Nights', icon: '🎮' },
  { id: 'food', name: 'Food & Drink', icon: '🍽️' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'networking', name: 'Networking', icon: '🤝' },
  { id: 'outdoor', name: 'Outdoor', icon: '🌳' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'other', name: 'Other', icon: '✨' }
]; 