
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, UserPlus, Check, MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileActionsProps {
  isCurrentUser: boolean;
  isFollowing: boolean;
  onEditProfile: () => void;
  onAccountSettings: () => void;
  onFollow: () => void;
  onMessage: () => void;
  profileName?: string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isCurrentUser,
  isFollowing,
  onEditProfile,
  onAccountSettings,
  onFollow,
  onMessage,
  profileName
}) => {
  const isMobile = useIsMobile();
  
  if (isCurrentUser) {
    return (
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
    );
  }
  
  return (
    <div className="flex gap-2 mt-2 md:mt-3">
      <Button 
        variant={isFollowing ? "outline" : "default"}
        className={isFollowing ? "bg-green-50 text-green-600 border-green-200" : "bg-thrivvo-teal hover:bg-thrivvo-teal/90"}
        size={isMobile ? "sm" : "default"}
        onClick={onFollow}
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
        onClick={onMessage}
      >
        <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
        <span className={isMobile ? "text-xs" : ""}>Message</span>
      </Button>
    </div>
  );
};

export default ProfileActions;
