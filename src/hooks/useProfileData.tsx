
import { useState, useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { FollowerData, fetchProfileData, fetchProfileFollowers, fetchProfileFollowing, checkIsFollowing } from '@/utils/profileApi';

type ProfileData = Tables<'profiles'>;

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
    const { data } = await fetchProfileFollowers(profileId);
    setFollowers(data);
  };
  
  const fetchFollowing = async (profileId: string) => {
    const { data } = await fetchProfileFollowing(profileId);
    setFollowing(data);
  };
  
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      
      try {
        // If we have a userId param and it's not the current user's ID
        if (userId && userId !== currentUser?.id) {
          setIsCurrentUser(false);
          
          // Fetch the profile data
          const { data, error } = await fetchProfileData(userId);
          if (error) throw error;
          setProfileData(data as ProfileData);
          
          // Load followers and following
          await fetchFollowers(userId);
          await fetchFollowing(userId);
          
          // Check if current user is following this profile
          if (currentUser?.id) {
            const { data: isFollowingData } = await checkIsFollowing(currentUser.id, userId);
            setIsFollowing(isFollowingData);
          }
        } else {
          // Current user's profile
          setIsCurrentUser(true);
          setProfileData(currentUserProfile as ProfileData);
          
          // Load current user's followers and following
          if (currentUser?.id) {
            await fetchFollowers(currentUser.id);
            await fetchFollowing(currentUser.id);
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
      loadProfileData();
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
