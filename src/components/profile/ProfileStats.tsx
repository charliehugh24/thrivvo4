
import React from 'react';

interface ProfileStatsProps {
  followers: { id: string; name: string; avatar: string }[];
  following: { id: string; name: string; avatar: string }[];
  onShowFollowers: () => void;
  onShowFollowing: () => void;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  followers,
  following,
  onShowFollowers,
  onShowFollowing
}) => {
  const followerCount = followers.length;
  const followingCount = following.length;
  
  return (
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
  );
};

export default ProfileStats;
