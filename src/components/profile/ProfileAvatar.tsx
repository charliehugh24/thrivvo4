
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileAvatarProps {
  avatarUrl: string;
  userName: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, userName }) => {
  const isMobile = useIsMobile();
  
  const getInitial = (name: string | null | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <Avatar className={`border-4 border-background ${isMobile ? 'h-20 w-20' : 'h-24 w-24'}`}>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>{getInitial(userName)}</AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
