
import { useState, useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type ProfileData = Tables<'profiles'>;

type FollowerData = {
  id: string;
  name: string;
  avatar: string;
};

// Mock data imports would go here in a real implementation

// Mock users for demo
const mockUsers = {
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

const mockFollowers = {
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

const mockFollowing = {
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

interface UseProfileDataProps {
  userId?: string;
  currentUser: any;
  currentUserProfile: any;
  onNavigate: (path: string) => void;
}

export const useProfileData = ({ 
  userId, 
  currentUser, 
  currentUserProfile, 
  onNavigate 
}: UseProfileDataProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState<FollowerData[]>([]);
  const [following, setFollowing] = useState<FollowerData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchFollowers = async (profileId: string) => {
    try {
      // Query followers: People who follow the profile
      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower_id,
          profiles!followers_follower_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('following_id', profileId);
      
      if (error) throw error;
      
      // Transform the data to match our FollowerData structure
      const formattedFollowers = data.map(item => ({
        id: item.profiles.id,
        name: item.profiles.username || 'User',
        avatar: item.profiles.avatar_url || '',
      }));
      
      setFollowers(formattedFollowers);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };
  
  const fetchFollowing = async (profileId: string) => {
    try {
      // Query following: People the profile follows
      const { data, error } = await supabase
        .from('followers')
        .select(`
          following_id,
          profiles!followers_following_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('follower_id', profileId);
      
      if (error) throw error;
      
      // Transform the data to match our FollowerData structure
      const formattedFollowing = data.map(item => ({
        id: item.profiles.id,
        name: item.profiles.username || 'User',
        avatar: item.profiles.avatar_url || '',
      }));
      
      setFollowing(formattedFollowing);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      try {
        // If we have a userId param and it's not the current user's ID
        if (userId && userId !== currentUser?.id) {
          setIsCurrentUser(false);
          
          // Check if this is a mock user first (starting with "user-")
          if (userId.startsWith('user-')) {
            console.log('Loading mock user profile:', userId);
            // Handle mock user profiles
            const mockUser = mockUsers[userId as keyof typeof mockUsers];
            if (mockUser) {
              setProfileData(mockUser as ProfileData);
              
              // Load mock followers/following for demo users
              const mockUserFollowers = mockFollowers[userId as keyof typeof mockFollowers] || [];
              const mockUserFollowing = mockFollowing[userId as keyof typeof mockFollowing] || [];
              
              setFollowers(mockUserFollowers);
              setFollowing(mockUserFollowing);
              
              // Check if current user is following this profile
              if (currentUser?.id) {
                if (currentUser.id.startsWith('user-')) {
                  const currentUserFollowing = mockFollowing[currentUser.id as keyof typeof mockFollowing] || [];
                  setIsFollowing(currentUserFollowing.some(f => f.id === userId));
                } else {
                  // Check if real user is following this mock user
                  const mockProfileFollowers = mockFollowers[userId as keyof typeof mockFollowers] || [];
                  setIsFollowing(mockProfileFollowers.some(f => f.id === currentUser.id));
                }
              }
            } else {
              throw new Error('Mock profile not found');
            }
          } else {
            // For real user IDs, validate UUID format before querying Supabase
            const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
            
            if (!isValidUUID) {
              console.error('Invalid UUID format:', userId);
              throw new Error('Invalid user ID format');
            }
            
            // Load real user profile from database
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no profile is found
            
            if (error) throw error;
            
            if (!data) {
              throw new Error('Profile not found');
            }
            
            setProfileData(data as ProfileData);
            
            // Load real followers and following
            await fetchFollowers(userId);
            await fetchFollowing(userId);
            
            // Check if current user is following this profile
            if (currentUser?.id) {
              const { data: followData } = await supabase
                .from('followers')
                .select('*')
                .eq('follower_id', currentUser.id)
                .eq('following_id', userId)
                .maybeSingle();
              
              setIsFollowing(!!followData);
            }
          }
        } else {
          // Current user's profile
          setIsCurrentUser(true);
          setProfileData(currentUserProfile as ProfileData);
          
          // Load current user's followers and following
          if (currentUser?.id) {
            if (currentUser.id.startsWith('user-')) {
              // Use mock data for demo users
              const mockUserFollowers = mockFollowers[currentUser.id as keyof typeof mockFollowers] || [];
              const mockUserFollowing = mockFollowing[currentUser.id as keyof typeof mockFollowing] || [];
              setFollowers(mockUserFollowers);
              setFollowing(mockUserFollowing);
            } else {
              // Load real followers and following for authenticated users
              await fetchFollowers(currentUser.id);
              await fetchFollowing(currentUser.id);
            }
          }
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: error.message || "The requested profile could not be loaded",
          variant: "destructive"
        });
        onNavigate('/'); // Navigate to home page on error
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchProfile();
    }
  }, [userId, currentUser, currentUserProfile, onNavigate]);

  return {
    profileData,
    isCurrentUser,
    isFollowing,
    setIsFollowing,
    followers,
    following,
    loading,
    fetchFollowers,
    fetchFollowing
  };
};
