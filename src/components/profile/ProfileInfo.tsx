
import React from 'react';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileInfoProps {
  userName: string;
  userLocation: string;
  userBio: string;
  userInterests: string[];
  isVerified: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userName,
  userLocation,
  userBio,
  userInterests,
  isVerified
}) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>{userName}</h1>
        {isVerified && (
          <Shield className="h-4 w-4 text-thrivvo-teal" />
        )}
      </div>
      <p className="text-muted-foreground text-xs md:text-sm mb-2">{userLocation}</p>
      <p className="text-xs md:text-sm mb-3 line-clamp-3 md:line-clamp-none">{userBio}</p>
      
      {userInterests?.length > 0 && (
        <div className="flex flex-wrap gap-1 my-2 md:my-3">
          {userInterests.map((interest: string, i: number) => (
            <Badge key={i} variant="outline" className="text-xs py-0">{interest}</Badge>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfileInfo;
