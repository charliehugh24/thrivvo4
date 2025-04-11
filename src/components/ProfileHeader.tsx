
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Settings, UserPlus, Check, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  const followerCount = followers.length;
  const followingCount = following.length;
  
  const getInitial = (name: string | null | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
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
        <Avatar className={`border-4 border-background ${isMobile ? 'h-20 w-20' : 'h-24 w-24'}`}>
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{getInitial(userName)}</AvatarFallback>
        </Avatar>
        
        {isCurrentUser ? (
          <div className="flex gap-1 md:gap-2 mb-2 scale-90 md:scale-100 origin-bottom-right">
            <Button 
              variant="outline" 
              className="bg-white"
              size={isMobile ? "sm" : "default"}
              onClick={onAccountSettings}
            >
              <Settings className="h-4 w-4 mr-1 md:mr-2" />
              <span className={isMobile ? "text-xs" : ""}>Account</span>
            </Button>
            <Button 
              variant="default" 
              className="bg-thrivvo-teal hover:bg-thrivvo-teal/90"
              size={isMobile ? "sm" : "default"}
              onClick={onEditProfile}
            >
              <span className={isMobile ? "text-xs" : ""}>Edit Profile</span>
            </Button>
          </div>
        ) : null}
      </div>
      
      <div className="px-3 md:px-4 py-2">
        <div className="flex items-center gap-2 mb-1">
          <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>{userName}</h1>
          {isVerified && (
            <Shield className="h-4 w-4 text-thrivvo-teal" />
          )}
        </div>
        <p className="text-muted-foreground text-xs md:text-sm mb-2">{userLocation}</p>
        <p className="text-xs md:text-sm mb-3 line-clamp-3 md:line-clamp-none">{userBio}</p>
        
        <div className="flex items-center gap-4 text-xs md:text-sm my-2">
          <div 
            className="cursor-pointer hover:underline flex items-center" 
            onClick={onShowFollowers}
          >
            <span className="font-bold text-thrivvo-teal">{followerCount}</span>
            <span className="ml-1">Followers</span>
          </div>
          <div 
            className="cursor-pointer hover:underline flex items-center"
            onClick={onShowFollowing}
          >
            <span className="font-bold text-thrivvo-teal">{followingCount}</span>
            <span className="ml-1">Following</span>
          </div>
        </div>

        {userInterests?.length > 0 && (
          <div className="flex flex-wrap gap-1 my-2 md:my-3">
            {userInterests.map((interest: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs py-0">{interest}</Badge>
            ))}
          </div>
        )}
        
        {!isCurrentUser && (
          <div className="flex gap-2 mt-2 md:mt-3">
            <Button 
              variant={isFollowing ? "outline" : "default"}
              className={isFollowing ? "bg-green-50 text-green-600 border-green-200" : "bg-thrivvo-teal hover:bg-thrivvo-teal/90"}
              size={isMobile ? "sm" : "default"}
              onClick={handleFollow}
            >
              {isFollowing ? (
                <>
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className={isMobile ? "text-xs" : ""}>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className={isMobile ? "text-xs" : ""}>Follow</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-white text-foreground border-input"
              size={isMobile ? "sm" : "default"}
              onClick={handleSendMessage}
            >
              <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className={isMobile ? "text-xs" : ""}>Message</span>
            </Button>
          </div>
        )}
        
        <Separator className="my-3 md:my-4" />
      </div>
    </div>
  );
};

export default ProfileHeader;
