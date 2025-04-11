
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { mockEvents } from '@/data/mockData';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabs from '@/components/ProfileTabs';
import FollowersList from '@/components/FollowersList';
import EditProfileDialog from '@/components/EditProfileDialog';
import AccountSettingsDialog from '@/components/AccountSettingsDialog';
import { useProfileData } from '@/hooks/useProfileData';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const isMobile = useIsMobile();
  
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);

  const { 
    profileData,
    isCurrentUser,
    isFollowing,
    setIsFollowing,
    followers,
    following,
    loading,
    fetchFollowers,
    fetchFollowing
  } = useProfileData({
    userId,
    currentUser: user,
    currentUserProfile: authProfile,
    onNavigate: navigate
  });
  
  const handleProfileUpdate = async () => {
    await refreshProfile();
  };
  
  if (loading) {
    return (
      <AppLayout activeTab="profile">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="animate-pulse space-y-4 w-full max-w-md">
            <div className="h-32 bg-muted rounded-md w-full"></div>
            <div className="flex justify-between items-end -mt-10">
              <div className="h-20 w-20 bg-muted rounded-full"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
            </div>
            <div className="space-y-2 mt-2">
              <div className="h-4 w-40 bg-muted rounded"></div>
              <div className="h-3 w-20 bg-muted rounded"></div>
              <div className="h-10 w-full bg-muted rounded"></div>
            </div>
            <div className="h-10 w-full bg-muted rounded"></div>
            <div className="h-40 w-full bg-muted rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  const userName = profileData?.username || 'User';

  return (
    <AppLayout activeTab="profile">
      <div className="flex flex-col min-h-screen pb-16">
        <ProfileHeader 
          profileData={profileData}
          isCurrentUser={isCurrentUser}
          isFollowing={isFollowing}
          followers={followers}
          following={following}
          userId={userId}
          user={user}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onAccountSettings={() => setIsAccountSettingsOpen(true)}
          onShowFollowers={() => setShowFollowers(true)}
          onShowFollowing={() => setShowFollowing(true)}
          setIsFollowing={setIsFollowing}
          fetchFollowers={fetchFollowers}
          fetchFollowing={fetchFollowing}
        />
        
        <ProfileTabs 
          userName={userName}
          isCurrentUser={isCurrentUser}
          mockEvents={mockEvents}
        />
      </div>
      
      {/* Followers Dialog */}
      <FollowersList 
        title="Followers"
        followers={followers}
        open={showFollowers}
        onOpenChange={setShowFollowers}
      />
      
      {/* Following Dialog */}
      <FollowersList 
        title="Following"
        followers={following}
        open={showFollowing}
        onOpenChange={setShowFollowing}
      />
      
      <EditProfileDialog 
        open={isEditProfileOpen} 
        onOpenChange={setIsEditProfileOpen}
        currentProfile={profileData}
        onProfileUpdate={handleProfileUpdate}
      />
      
      <AccountSettingsDialog 
        open={isAccountSettingsOpen} 
        onOpenChange={setIsAccountSettingsOpen}
      />
    </AppLayout>
  );
};

export default Profile;
