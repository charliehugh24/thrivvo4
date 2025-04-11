
// Mock users for demo
export const mockUsers = {
  'user-1': {
    id: 'user-1',
    username: 'Alex Johnson',
    avatar_url: '/lovable-uploads/d7368d4b-69d9-45f2-af66-f97850473f89.png',
    verified: true,
    bio: 'Adventure seeker and music lover',
    location: 'San Francisco, CA',
    interests: ['music', 'hiking', 'photography']
  },
  'user-2': {
    id: 'user-2',
    username: 'Sam Rivera',
    avatar_url: null,
    bio: 'Food enthusiast and traveler',
    location: 'Chicago, IL',
    interests: ['food', 'travel', 'cooking']
  },
  'user-3': {
    id: 'user-3',
    username: 'Taylor Morgan',
    avatar_url: '/lovable-uploads/de943395-a2a4-4ee9-bed4-16cc40cfdc47.png',
    verified: true,
    bio: 'Tech geek and coffee addict',
    location: 'Austin, TX',
    interests: ['technology', 'coffee', 'gaming']
  },
  'user-4': {
    id: 'user-4',
    username: 'Jordan Kim',
    avatar_url: null,
    bio: 'Fitness instructor and wellness coach',
    location: 'Denver, CO',
    interests: ['fitness', 'nutrition', 'meditation']
  },
  'user-5': {
    id: 'user-5',
    username: 'Casey Lopez',
    avatar_url: '/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png',
    bio: 'Artist and creative mind',
    location: 'Portland, OR',
    interests: ['art', 'design', 'music']
  }
};

export const mockFollowers = {
  'user-1': [
    { id: 'user-2', name: 'Sam Rivera', avatar: 'https://randomuser.me/api/portraits/women/79.jpg' },
    { id: 'user-3', name: 'Taylor Morgan', avatar: '/lovable-uploads/de943395-a2a4-4ee9-bed4-16cc40cfdc47.png' },
    { id: 'user-4', name: 'Jordan Kim', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  ],
  'user-2': [
    { id: 'user-1', name: 'Alex Johnson', avatar: '/lovable-uploads/d7368d4b-69d9-45f2-af66-f97850473f89.png' },
    { id: 'user-5', name: 'Casey Lopez', avatar: '/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png' },
  ],
  'user-3': [
    { id: 'user-1', name: 'Alex Johnson', avatar: '/lovable-uploads/d7368d4b-69d9-45f2-af66-f97850473f89.png' },
    { id: 'user-4', name: 'Jordan Kim', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  ],
  'user-4': [
    { id: 'user-5', name: 'Casey Lopez', avatar: '/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png' },
  ],
  'user-5': [
    { id: 'user-2', name: 'Sam Rivera', avatar: 'https://randomuser.me/api/portraits/women/79.jpg' },
    { id: 'user-3', name: 'Taylor Morgan', avatar: '/lovable-uploads/de943395-a2a4-4ee9-bed4-16cc40cfdc47.png' },
  ],
};

export const mockFollowing = {
  'user-1': [
    { id: 'user-2', name: 'Sam Rivera', avatar: 'https://randomuser.me/api/portraits/women/79.jpg' },
    { id: 'user-3', name: 'Taylor Morgan', avatar: '/lovable-uploads/de943395-a2a4-4ee9-bed4-16cc40cfdc47.png' },
  ],
  'user-2': [
    { id: 'user-1', name: 'Alex Johnson', avatar: '/lovable-uploads/d7368d4b-69d9-45f2-af66-f97850473f89.png' },
  ],
  'user-3': [
    { id: 'user-5', name: 'Casey Lopez', avatar: '/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png' },
  ],
  'user-4': [
    { id: 'user-3', name: 'Taylor Morgan', avatar: '/lovable-uploads/de943395-a2a4-4ee9-bed4-16cc40cfdc47.png' },
  ],
  'user-5': [
    { id: 'user-4', name: 'Jordan Kim', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  ],
};
