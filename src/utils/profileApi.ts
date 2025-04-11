
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { mockUsers, mockFollowers, mockFollowing } from '@/data/mockProfileData';

export type FollowerData = {
  id: string;
  name: string;
  avatar: string;
};

export const fetchProfileData = async (userId: string) => {
  try {
    // Check if this is a mock user first (starting with "user-")
    if (userId.startsWith('user-')) {
      console.log('Loading mock user profile:', userId);
      // Handle mock user profiles
      const mockUser = mockUsers[userId as keyof typeof mockUsers];
      if (mockUser) {
        return { data: mockUser, error: null };
      } else {
        throw new Error('Mock profile not found');
      }
    } 
    
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
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in fetchProfileData:', error);
    return { data: null, error };
  }
};

export const fetchProfileFollowers = async (profileId: string) => {
  try {
    // Check if this is a mock user
    if (profileId.startsWith('user-')) {
      const mockUserFollowers = mockFollowers[profileId as keyof typeof mockFollowers] || [];
      return { data: mockUserFollowers, error: null };
    }

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
    
    return { data: formattedFollowers, error: null };
  } catch (error) {
    console.error('Error fetching followers:', error);
    return { data: [], error };
  }
};

export const fetchProfileFollowing = async (profileId: string) => {
  try {
    // Check if this is a mock user
    if (profileId.startsWith('user-')) {
      const mockUserFollowing = mockFollowing[profileId as keyof typeof mockFollowing] || [];
      return { data: mockUserFollowing, error: null };
    }

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
    
    return { data: formattedFollowing, error: null };
  } catch (error) {
    console.error('Error fetching following:', error);
    return { data: [], error };
  }
};

export const checkIsFollowing = async (currentUserId: string, profileId: string) => {
  try {
    // Handle mock users
    if (currentUserId.startsWith('user-') || profileId.startsWith('user-')) {
      if (currentUserId.startsWith('user-')) {
        const currentUserFollowing = mockFollowing[currentUserId as keyof typeof mockFollowing] || [];
        return { data: currentUserFollowing.some(f => f.id === profileId), error: null };
      } else {
        // Check if real user is following this mock user
        const mockProfileFollowers = mockFollowers[profileId as keyof typeof mockFollowers] || [];
        return { data: mockProfileFollowers.some(f => f.id === currentUserId), error: null };
      }
    }
    
    // Check if current user is following this profile
    const { data, error } = await supabase
      .from('followers')
      .select('*')
      .eq('follower_id', currentUserId)
      .eq('following_id', profileId)
      .maybeSingle();
    
    if (error) throw error;
    
    return { data: !!data, error: null };
  } catch (error) {
    console.error('Error checking follow status:', error);
    return { data: false, error };
  }
};
