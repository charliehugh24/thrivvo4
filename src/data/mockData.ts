
import { Event, User, EventCategory } from '../types';
import { addHours, addMinutes, formatISO } from 'date-fns';

// Helper function to generate ISO string for current time plus some offset
const timeFromNow = (hours: number = 0, minutes: number = 0): string => {
  const now = new Date();
  const time = addMinutes(addHours(now, hours), minutes);
  return formatISO(time);
};

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Rooftop Sunset Party',
    description: 'Join us for drinks, music, and amazing views at our spontaneous rooftop gathering!',
    category: 'party',
    location: {
      name: 'The Skyline Lounge',
      address: '123 Downtown Ave',
      distance: 1.2,
    },
    time: {
      start: timeFromNow(1),
      end: timeFromNow(5),
    },
    host: {
      id: 'host1',
      name: 'Alex Rivera',
      verified: true,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    attendees: {
      count: 18,
      max: 30,
    },
    price: {
      amount: 15,
      currency: 'USD',
    },
    images: [
      'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    vibe: ['trendy', 'chill', 'upscale'],
    isPrivate: false,
  },
  {
    id: '2',
    title: 'Impromptu Jazz Night',
    description: 'Local jazz artists performing spontaneous jam sessions. Come enjoy the music and good company!',
    category: 'concert',
    location: {
      name: 'The Blue Note',
      address: '45 Music Row',
      distance: 0.8,
    },
    time: {
      start: timeFromNow(0, 30),
      end: timeFromNow(3, 30),
    },
    host: {
      id: 'host2',
      name: 'Jasmine Kim',
      verified: true,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    attendees: {
      count: 24,
    },
    images: [
      'https://images.unsplash.com/photo-1514668899050-120c5b63ffb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    vibe: ['relaxed', 'artistic', 'intimate'],
    isPrivate: false,
  },
  {
    id: '3',
    title: 'Pickup Basketball Game',
    description: 'We need a few more players for a friendly 3v3 basketball game. All skill levels welcome!',
    category: 'fitness',
    location: {
      name: 'Central Park Courts',
      address: 'Central Park, Court 3',
      distance: 1.5,
    },
    time: {
      start: timeFromNow(0, 45),
      end: timeFromNow(2, 45),
    },
    host: {
      id: 'host3',
      name: 'Marcus Johnson',
      verified: false,
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    attendees: {
      count: 4,
      max: 6,
    },
    images: [
      'https://images.unsplash.com/photo-1518650810476-5467bfb150ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    vibe: ['active', 'casual', 'competitive'],
    isPrivate: false,
  },
  {
    id: '4',
    title: 'Craft Beer Tasting',
    description: 'Spontaneous craft beer tasting with local brewers showcasing their latest creations!',
    category: 'bar',
    location: {
      name: 'Hoppy Hour Brewery',
      address: '789 Craft Lane',
      distance: 2.1,
    },
    time: {
      start: timeFromNow(1, 15),
      end: timeFromNow(4, 15),
    },
    host: {
      id: 'host4',
      name: 'Emma Watson',
      verified: true,
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    },
    attendees: {
      count: 32,
      max: 50,
    },
    price: {
      amount: 25,
      currency: 'USD',
    },
    images: [
      'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1574711153233-7ab45bd0f941?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    vibe: ['social', 'foodie', 'relaxed'],
    isPrivate: false,
  },
  {
    id: '5',
    title: 'Tech Networking Mixer',
    description: 'Casual networking event for tech professionals and enthusiasts. Share ideas and make connections!',
    category: 'networking',
    location: {
      name: 'Innovation Hub',
      address: '555 Tech Blvd',
      distance: 3.0,
    },
    time: {
      start: timeFromNow(2),
      end: timeFromNow(4),
    },
    host: {
      id: 'host5',
      name: 'David Chen',
      verified: true,
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    attendees: {
      count: 45,
    },
    images: [
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    vibe: ['professional', 'innovative', 'collaborative'],
    isPrivate: false,
  },
  {
    id: '6',
    title: 'Weekend Board Game Night',
    description: 'Bringing out our collection of board games! From strategy to party games, we have it all.',
    category: 'game-night',
    location: {
      name: 'The Game Table Café',
      address: '121 Fun Street',
      distance: 1.7,
    },
    time: {
      start: timeFromNow(0, 30),
      end: timeFromNow(4, 30),
    },
    host: {
      id: 'host6',
      name: 'Sophia Garcia',
      verified: false,
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    attendees: {
      count: 12,
      max: 16,
    },
    price: {
      amount: 5,
      currency: 'USD',
    },
    images: [
      'https://images.unsplash.com/photo-1606503153255-59d8b2e4739e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    vibe: ['fun', 'competitive', 'social'],
    isPrivate: false,
  },
  {
    id: '7',
    title: 'Sunset Beach Volleyball',
    description: 'Casual beach volleyball games as the sun sets. No experience needed, just good vibes!',
    category: 'outdoor',
    location: {
      name: 'Oceanside Beach',
      address: 'Oceanside Beach, Net 3',
      distance: 4.2,
    },
    time: {
      start: timeFromNow(1, 30),
      end: timeFromNow(3, 30),
    },
    host: {
      id: 'host7',
      name: 'Tyler Rodriguez',
      verified: true,
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    },
    attendees: {
      count: 9,
      max: 12,
    },
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    vibe: ['active', 'beachy', 'social'],
    isPrivate: false,
  },
  {
    id: '8',
    title: 'Pop-Up Taco Night',
    description: 'Local chef hosting a spontaneous taco night with authentic recipes and fresh ingredients!',
    category: 'food',
    location: {
      name: 'Urban Kitchen',
      address: '200 Foodie Ave',
      distance: 2.5,
    },
    time: {
      start: timeFromNow(1),
      end: timeFromNow(4),
    },
    host: {
      id: 'host8',
      name: 'Miguel Santos',
      verified: true,
      avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
    },
    attendees: {
      count: 28,
      max: 35,
    },
    price: {
      amount: 20,
      currency: 'USD',
    },
    images: [
      'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1509598470018-8425f9f3a8bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    vibe: ['foodie', 'casual', 'lively'],
    isPrivate: false,
  },
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Jordan Smith',
    avatar: 'https://randomuser.me/api/portraits/women/79.jpg',
    interests: ['party', 'club', 'bar'],
    status: 'available',
    distance: 0.5,
  },
  {
    id: 'user2',
    name: 'Casey Wong',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    interests: ['game-night', 'bar', 'food'],
    status: 'available',
    distance: 1.2,
  },
  {
    id: 'user3',
    name: 'Taylor Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    interests: ['fitness', 'outdoor', 'networking'],
    status: 'available',
    distance: 0.8,
  },
  {
    id: 'user4',
    name: 'Riley Thompson',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    interests: ['concert', 'club', 'party'],
    status: 'available',
    distance: 1.5,
  },
  {
    id: 'user5',
    name: 'Morgan Davis',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    interests: ['food', 'networking', 'bar'],
    status: 'available',
    distance: 2.1,
  },
];

export const eventCategories: { id: EventCategory; name: string; icon: string }[] = [
  { id: 'party', name: 'House Parties', icon: '🏠' },
  { id: 'club', name: 'Club Nights', icon: '🎵' },
  { id: 'bar', name: 'Bar Hangouts', icon: '🍻' },
  { id: 'concert', name: 'Live Music', icon: '🎸' },
  { id: 'game-night', name: 'Game Nights', icon: '🎲' },
  { id: 'food', name: 'Food & Drinks', icon: '🍔' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'networking', name: 'Networking', icon: '🤝' },
  { id: 'outdoor', name: 'Outdoor', icon: '🌳' },
  { id: 'other', name: 'Other', icon: '✨' },
];
