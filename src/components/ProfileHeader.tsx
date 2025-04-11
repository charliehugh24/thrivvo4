
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tables } from '@/integrations/supabase/types';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileActions from '@/components/profile/ProfileActions';

type ProfileData = Tables<'profiles'>;

interface ProfileHeaderProps {
  profileData: ProfileData | null;
  isCurrentUser: boolean;
  isFollowing: boolean;
  followers: { id: string; name: string; avatar: string }[];
  following: { id: string; name: string; avatar: string }[];
  userId?: string;
  user: any;
  onEditProfile: () => void;
  onAccountSettings: () => void;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
  setIsFollowing: (isFollowing: boolean) => void;
  fetchFollowers: (profileId: string) => Promise<void>;
  fetchFollowing: (profileId: string) => Promise<void>;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  isCurrentUser,
  isFollowing,
  followers,
  following,
  userId,
  user,
  onEditProfile,
  onAccountSettings,
  onShowFollowers,
  onShowFollowing,
  setIsFollowing,
  fetchFollowers,
  fetchFollowing
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const userName = profileData?.username || 'User';
  const userLocation = profileData?.location || 'Location not set';
  const userBio = profileData?.bio || 'No bio available';
  const userAvatar = profileData?.avatar_url || '';
  const userInterests = profileData?.interests || [];
  const isVerified = profileData?.verified || false;
  
  const handleFollow = async () => {
    if (!user || !userId) return;
    
    try {
      if (isFollowing) {
        // Unfollow
        if (user.id.startsWith('user-') || userId.startsWith('user-')) {
          // Handle mock data
          if (user.id.startsWith('user-')) {
            const userFollowing = [...following];
            const updatedFollowing = userFollowing.filter(f => f.id !== userId);
            // This will trigger a re-render in the parent component
          }
          
          if (userId.startsWith('user-')) {
            const profileFollowers = [...followers];
            const updatedFollowers = profileFollowers.filter(f => f.id !== user.id);
            // This will trigger a re-render in the parent component
          }
        } else {
          // Real database operation
          const { error } = await supabase
            .from('followers')
            .delete()
            .eq('follower_id', user.id)
            .eq('following_id', userId);
          
          if (error) throw error;
          
          // Update local state
          await fetchFollowers(userId);
          if (isCurrentUser) {
            await fetchFollowing(user.id);
          }
        }
      } else {
        // Follow
        if (user.id.startsWith('user-') || userId.startsWith('user-')) {
          // Handle mock data - parent component will handle the followers/following update
        } else {
          // Real database operation
          const { error } = await supabase
            .from('followers')
            .insert({
              follower_id: user.id,
              following_id: userId,
            });
          
          if (error) throw error;
          
          // Update local state
          await fetchFollowers(userId);
          if (isCurrentUser) {
            await fetchFollowing(user.id);
          }
        }
      }
      
      // Toggle following state
      setIsFollowing(!isFollowing);
      
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing 
          ? `You are no longer following ${profileData?.username || 'this user'}` 
          : `You are now following ${profileData?.username || 'this user'}`
      });
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast({
        title: "Error",
        description: "There was an error updating your follow status",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = () => {
    if (userId) {
      // If it's Sam Rivera, let's add a specific message
      if (userId === 'user-2') {
        navigate(`?message=${userId}&text=Hi Sam! I wanted to chat about the upcoming events this weekend.`);
      } else {
        navigate(`?message=${userId}`);
      }
    }
  };

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-thrivvo-teal to-thrivvo-orange/70 h-32 md:h-40" />
      
      <div className={`px-3 md:px-4 relative ${isMobile ? '-mt-10' : '-mt-12'} flex justify-between items-end`}>
        <ProfileAvatar 
          avatarUrl={userAvatar}
          userName={userName}
        />
        
        {isCurrentUser && (
          <ProfileActions 
            isCurrentUser={isCurrentUser}
            isFollowing={isFollowing}
            onEditProfile={onEditProfile}
            onAccountSettings={onAccountSettings}
            onFollow={handleFollow}
            onMessage={handleSendMessage}
          />
        )}
      </div>
      
      <div className="px-3 md:px-4 py-2">
        <ProfileInfo 
          userName={userName}
          userLocation={userLocation}
          userBio={userBio}
          userInterests={userInterests}
          isVerified={isVerified}
        />
        
        <ProfileStats 
          followers={followers}
          following={following}
          onShowFollowers={onShowFollowers}
          onShowFollowing={onShowFollowing}
        />
        
        {!isCurrentUser && (
          <ProfileActions 
            isCurrentUser={isCurrentUser}
            isFollowing={isFollowing}
            onEditProfile={onEditProfile}
            onAccountSettings={onAccountSettings}
            onFollow={handleFollow}
            onMessage={handleSendMessage}
            profileName={profileData?.username}
          />
        )}
        
        <Separator className="my-3 md:my-4" />
      </div>
    </div>
  );
};

export default ProfileHeader;
