
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventList from '@/components/EventList';
import { mockEvents } from '@/data/mockData';
import { Shield, Settings, Users } from 'lucide-react';

// Mock user data - in a real app, this would come from an API
const currentUser = {
  id: 'current-user',
  name: 'Jamie Smith',
  avatar: '/lovable-uploads/d7368d4b-69d9-45f2-af66-f97850473f89.png',
  bio: 'Event lover and social butterfly 🦋',
  location: 'San Francisco, CA',
  verified: true,
  followers: 256,
  following: 124,
  interests: ['music', 'food', 'travel', 'art', 'fitness']
};

// Mock data for other users from the AttendeesList
const mockUsers = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    avatar: '/lovable-uploads/d7368d4b-69d9-45f2-af66-f97850473f89.png',
    bio: 'Adventure seeker and music lover',
    location: 'Los Angeles, CA',
    verified: true,
    followers: 342,
    following: 211,
    interests: ['music', 'hiking', 'photography']
  },
  {
    id: 'user-2',
    name: 'Sam Rivera',
    avatar: '',
    bio: 'Food enthusiast and traveler',
    location: 'New York, NY',
    verified: false,
    followers: 189,
    following: 156,
    interests: ['food', 'travel', 'cooking']
  },
  {
    id: 'user-3',
    name: 'Taylor Morgan',
    avatar: '/lovable-uploads/de943395-a2a4-4ee9-bed4-16cc40cfdc47.png',
    bio: 'Tech geek and coffee addict',
    location: 'Seattle, WA',
    verified: true,
    followers: 423,
    following: 267,
    interests: ['technology', 'coffee', 'gaming']
  },
  {
    id: 'user-4',
    name: 'Jordan Kim',
    avatar: '',
    bio: 'Fitness instructor and wellness coach',
    location: 'Chicago, IL',
    verified: false,
    followers: 512,
    following: 298,
    interests: ['fitness', 'nutrition', 'meditation']
  },
  {
    id: 'user-5',
    name: 'Casey Lopez',
    avatar: '/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png',
    bio: 'Artist and creative mind',
    location: 'Austin, TX',
    verified: false,
    followers: 276,
    following: 184,
    interests: ['art', 'design', 'music']
  }
];

// Combine current user and mock users for easy lookup
const allUsers = [currentUser, ...mockUsers];

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(currentUser);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  useEffect(() => {
    // If there's a userId parameter, try to find the user
    if (userId) {
      const foundUser = allUsers.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setIsCurrentUser(foundUser.id === currentUser.id);
      }
    } else {
      // If no userId parameter, show current user profile
      setUser(currentUser);
      setIsCurrentUser(true);
    }
  }, [userId]);
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <AppLayout activeTab="profile">
      <div className="flex flex-col min-h-screen pb-16">
        <div className="relative">
          {/* Profile header/cover */}
          <div className="bg-gradient-to-r from-thrivvo-teal to-thrivvo-orange/70 h-40" />
          
          {/* Profile picture and actions */}
          <div className="px-4 relative -mt-12 flex justify-between items-end">
            <Avatar className="border-4 border-background h-24 w-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            {isCurrentUser ? (
              <Button variant="outline" className="mb-2">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button 
                variant={isFollowing ? "outline" : "default"}
                className={isFollowing ? "mb-2" : "mb-2 bg-thrivvo-teal hover:bg-thrivvo-teal/90"}
                onClick={handleFollow}
              >
                <Users className="h-4 w-4 mr-2" />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
          
          {/* Profile info */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold">{user.name}</h1>
              {user.verified && (
                <Shield className="h-4 w-4 text-thrivvo-teal" />
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-2">{user.location}</p>
            <p className="text-sm mb-3">{user.bio}</p>
            
            <div className="flex items-center gap-4 text-sm my-2">
              <div>
                <span className="font-bold">{user.followers}</span> Followers
              </div>
              <div>
                <span className="font-bold">{user.following}</span> Following
              </div>
            </div>

            {user.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1 my-3">
                {user.interests.map((interest, i) => (
                  <Badge key={i} variant="outline">{interest}</Badge>
                ))}
              </div>
            )}
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
              
              {/* Show events where this user is the host */}
              <EventList 
                events={mockEvents.filter(event => event.host.name === user.name)}
                variant="compact"
                emptyStateMessage={
                  isCurrentUser 
                    ? "You haven't hosted any events yet. Create your first event!" 
                    : `${user.name} hasn't hosted any events yet.`
                }
              />
            </div>
          </TabsContent>
  
          <TabsContent value="attending" className="p-4 pt-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Events Attending</h3>
              
              {/* In a real app, you would filter events this user is attending */}
              <EventList 
                events={mockEvents.slice(0, 2)} 
                variant="compact"
                emptyStateMessage={
                  isCurrentUser 
                    ? "You're not attending any upcoming events." 
                    : `${user.name} is not attending any upcoming events.`
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
                  {user.name} hasn't shared any photos yet.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
