
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventList from '@/components/EventList';
import { mockEvents } from '@/data/mockData';
import { Shield, Settings, Users, MessageCircle, UserPlus, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import EditProfileDialog from '@/components/EditProfileDialog';
import AccountSettingsDialog from '@/components/AccountSettingsDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

type ProfileData = Tables<'profiles'>;

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

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, profile: authProfile, refreshProfile } = useAuth();
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get followers and following for the current profile
  const followers = userId && mockFollowers[userId as keyof typeof mockFollowers] 
    ? mockFollowers[userId as keyof typeof mockFollowers] 
    : [];
  
  const following = userId && mockFollowing[userId as keyof typeof mockFollowing] 
    ? mockFollowing[userId as keyof typeof mockFollowing] 
    : [];
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      try {
        if (userId && userId !== user?.id) {
          setIsCurrentUser(false);
          
          // Check if the current user is following this profile
          if (userId.startsWith('user-') && user?.id) {
            const currentUserFollowing = mockFollowing[user.id as keyof typeof mockFollowing] || [];
            setIsFollowing(currentUserFollowing.some(f => f.id === userId));
          }
          
          if (userId.startsWith('user-') && mockUsers[userId as keyof typeof mockUsers]) {
            setProfileData(mockUsers[userId as keyof typeof mockUsers] as ProfileData);
          } else {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (error) throw error;
            setProfileData(data as ProfileData);
          }
        } else {
          setIsCurrentUser(true);
          setProfileData(authProfile as ProfileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: "The requested profile could not be loaded",
          variant: "destructive"
        });
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [userId, user, authProfile, navigate]);
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You are no longer following ${profileData?.username || 'this user'}` 
        : `You are now following ${profileData?.username || 'this user'}`
    });
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
  
  const handleProfileUpdate = async () => {
    await refreshProfile();
  };
  
  const getInitial = (name: string | null | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  if (loading) {
    return (
      <AppLayout activeTab="profile">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-12 bg-muted rounded-full mx-auto"></div>
            <div className="h-4 w-40 bg-muted rounded mx-auto"></div>
            <div className="h-3 w-20 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  const userName = profileData?.username || 'User';
  const userLocation = profileData?.location || 'Location not set';
  const userBio = profileData?.bio || 'No bio available';
  const userAvatar = profileData?.avatar_url || '';
  const userInterests = profileData?.interests || [];
  const isVerified = profileData?.verified || false;
  
  const followerCount = followers.length;
  const followingCount = following.length;

  return (
    <AppLayout activeTab="profile">
      <div className="flex flex-col min-h-screen pb-16">
        <div className="relative">
          <div className="bg-gradient-to-r from-thrivvo-teal to-thrivvo-orange/70 h-40" />
          
          <div className="px-4 relative -mt-12 flex justify-between items-end">
            <Avatar className="border-4 border-background h-24 w-24">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{getInitial(userName)}</AvatarFallback>
            </Avatar>
            
            {isCurrentUser ? (
              <div className="flex gap-2 mb-2">
                <Button 
                  variant="outline" 
                  className="bg-white"
                  onClick={() => setIsAccountSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account
                </Button>
                <Button 
                  variant="default" 
                  className="bg-thrivvo-teal hover:bg-thrivvo-teal/90"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  Edit Profile
                </Button>
              </div>
            ) : null}
          </div>
          
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold">{userName}</h1>
              {isVerified && (
                <Shield className="h-4 w-4 text-thrivvo-teal" />
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-2">{userLocation}</p>
            <p className="text-sm mb-3">{userBio}</p>
            
            <div className="flex items-center gap-4 text-sm my-2">
              <div 
                className="cursor-pointer hover:underline flex items-center" 
                onClick={() => setShowFollowers(true)}
              >
                <span className="font-bold text-thrivvo-teal">{followerCount}</span>
                <span className="ml-1">Followers</span>
              </div>
              <div 
                className="cursor-pointer hover:underline flex items-center"
                onClick={() => setShowFollowing(true)}
              >
                <span className="font-bold text-thrivvo-teal">{followingCount}</span>
                <span className="ml-1">Following</span>
              </div>
            </div>

            {userInterests?.length > 0 && (
              <div className="flex flex-wrap gap-1 my-3">
                {userInterests.map((interest: string, i: number) => (
                  <Badge key={i} variant="outline">{interest}</Badge>
                ))}
              </div>
            )}
            
            {!isCurrentUser && (
              <div className="flex gap-2 mt-3">
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  className={isFollowing ? "bg-green-50 text-green-600 border-green-200" : "bg-thrivvo-teal hover:bg-thrivvo-teal/90"}
                  onClick={handleFollow}
                >
                  {isFollowing ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="bg-white text-foreground border-input"
                  onClick={handleSendMessage}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            )}
            
            <Separator className="my-4" />
          </div>
        </div>
        
        <Tabs defaultValue="events" className="flex-1">
          <div className="px-4 border-b">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger value="events" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-thrivvo-teal rounded-none h-12">
                Events
              </TabsTrigger>
              <TabsTrigger value="attending" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-thrivvo-teal rounded-none h-12">
                Attending
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-thrivvo-teal rounded-none h-12">
                Photos
              </TabsTrigger>
            </TabsList>
          </div>
  
          <TabsContent value="events" className="p-4 pt-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hosted Events</h3>
              
              <EventList 
                events={mockEvents.filter(event => event.host.name === userName)}
                emptyMessage={
                  isCurrentUser 
                    ? "You haven't hosted any events yet. Create your first event!" 
                    : `${userName} hasn't hosted any events yet.`
                }
              />
            </div>
          </TabsContent>
  
          <TabsContent value="attending" className="p-4 pt-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Events Attending</h3>
              
              <EventList 
                events={mockEvents.slice(0, 2)} 
                emptyMessage={
                  isCurrentUser 
                    ? "You're not attending any upcoming events." 
                    : `${userName} is not attending any upcoming events.`
                }
              />
            </div>
          </TabsContent>
  
          <TabsContent value="photos" className="p-4 pt-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Photos</h3>
              
              {isCurrentUser ? (
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="aspect-square overflow-hidden">
                      <CardContent className="p-0">
                        <img 
                          src={`/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png`} 
                          alt={`Gallery image ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {userName} hasn't shared any photos yet.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Followers Dialog */}
      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {followers.length > 0 ? (
              <div className="space-y-3 py-2">
                {followers.map((follower) => (
                  <div 
                    key={follower.id} 
                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                    onClick={() => {
                      setShowFollowers(false);
                      navigate(`/profile/${follower.id}`);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={follower.avatar} />
                        <AvatarFallback>{getInitial(follower.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{follower.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No followers yet.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Following Dialog */}
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {following.length > 0 ? (
              <div className="space-y-3 py-2">
                {following.map((followedUser) => (
                  <div 
                    key={followedUser.id} 
                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer"
                    onClick={() => {
                      setShowFollowing(false);
                      navigate(`/profile/${followedUser.id}`);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={followedUser.avatar} />
                        <AvatarFallback>{getInitial(followedUser.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{followedUser.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Not following anyone yet.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
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
