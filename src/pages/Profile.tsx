
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventCard from '@/components/EventCard';
import EventList from '@/components/EventList';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, Calendar, Plus, Camera, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Temporary mock data for the profile
const profileData = {
  name: "Alex Johnson",
  age: 28,
  gender: "Non-binary",
  bio: "Adventure seeker and music lover. Always looking for the next exciting event or concert to attend!",
  location: "San Francisco, CA",
  hashtags: ["music", "outdoors", "food", "art", "travel"],
  avatar: "/lovable-uploads/d7368d4b-69d9-45f2-af66-f97850473f89.png",
  joinedDate: "January 2023",
  hostedEvents: 12,
  attendedEvents: 24
};

// Mock event data for the events tab
import { Event } from '@/types';
import { mockEvents } from '@/data/mockData';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(profileData);
  const [formData, setFormData] = useState(profileData);
  const [activeTab, setActiveTab] = useState("about");
  const [eventsSubTab, setEventsSubTab] = useState("myEvents");
  const [userCreatedEvents, setUserCreatedEvents] = useState<Event[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user created events from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem('userCreatedEvents');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      setUserCreatedEvents(parsedEvents);
    }
  }, []);

  // Filter events created by the current user (using the mock user ID for now)
  // In a real app, you would compare against the actual logged-in user ID
  const createdEvents = [
    ...userCreatedEvents,
    ...mockEvents.filter(event => event.host.id === "user-1")
  ];
  const attendingEvents = mockEvents.slice(0, 3); // Just using some events for demo

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData(profile);
    }
  };

  const handleSaveProfile = () => {
    setProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: imageUrl }));
        toast({
          title: "Image selected",
          description: "Your profile picture will be updated when you save",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle swipe actions for the EventCard component
  const handleSwipeLeft = () => {
    // For now, just a placeholder for the swipe left action
    console.log("Swiped left on event");
  };

  const handleSwipeRight = () => {
    // For now, just a placeholder for the swipe right action
    console.log("Swiped right on event");
  };

  return (
    <AppLayout activeTab="profile">
      <div className="p-4 space-y-6">
        {/* Profile header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEditToggle}
          >
            {isEditing ? (
              <><Save className="mr-2" size={16} /> Save</>
            ) : (
              <><Edit className="mr-2" size={16} /> Edit</>
            )}
          </Button>
        </div>

        {/* Profile info */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-center w-full">
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <Avatar 
              className={`w-24 h-24 border-2 border-thrivvo-teal ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={handleAvatarClick}
            >
              {formData.avatar ? (
                <AvatarImage src={formData.avatar} alt="Profile" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-muted flex items-center justify-center">
                  {isEditing ? (
                    <Camera className="w-8 h-8 text-thrivvo-teal" />
                  ) : (
                    profile.name.charAt(0)
                  )}
                </AvatarFallback>
              )}
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <Image className="h-8 w-8 text-white" />
                </div>
              )}
            </Avatar>
          </div>
          
          {isEditing ? (
            <div className="w-full space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="w-20">
                  <label className="text-sm font-medium">Age</label>
                  <Input 
                    name="age" 
                    type="number" 
                    value={formData.age} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Gender</label>
                <Input 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  className="h-24"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Hashtags (comma separated)</label>
                <Input 
                  name="hashtags" 
                  value={formData.hashtags.join(", ")} 
                  onChange={(e) => {
                    const tags = e.target.value.split(",").map(tag => tag.trim());
                    setFormData(prev => ({ ...prev, hashtags: tags }));
                  }} 
                />
              </div>
              
              <Button 
                className="w-full mt-2 bg-thrivvo-teal hover:bg-thrivvo-teal/90" 
                onClick={handleSaveProfile}
              >
                Save Profile
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold">{profile.name}, {profile.age}</h2>
              <p className="text-muted-foreground">{profile.gender} • {profile.location}</p>
              <p className="text-sm max-w-md">{profile.bio}</p>
              
              <div className="flex flex-wrap justify-center gap-1 pt-2">
                {profile.hashtags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-thrivvo-teal/10 text-thrivvo-teal rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-center gap-4 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>Joined {profile.joinedDate}</span>
                </div>
                <div>
                  <span>{profile.hostedEvents} events hosted</span>
                </div>
                <div>
                  <span>{profile.attendedEvents} events attended</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs for About/Events */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4 pt-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">About Me</h3>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium mb-2">Interests</h3>
              <div className="flex flex-wrap gap-1">
                {profile.hashtags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-muted rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">My Events</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/add-event')}
              >
                Create Event
              </Button>
            </div>
            
            {/* Sub-tabs for Events created vs Events attending */}
            <div className="border-b">
              <div className="flex space-x-4">
                <button
                  className={`pb-2 px-1 text-sm ${eventsSubTab === 'myEvents' ? 'border-b-2 border-thrivvo-teal text-thrivvo-teal font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setEventsSubTab('myEvents')}
                >
                  Events I Created
                </button>
                <button
                  className={`pb-2 px-1 text-sm ${eventsSubTab === 'attending' ? 'border-b-2 border-thrivvo-teal text-thrivvo-teal font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setEventsSubTab('attending')}
                >
                  Events I'm Attending
                </button>
              </div>
            </div>
            
            {/* Events content based on sub-tab */}
            {eventsSubTab === 'myEvents' ? (
              <div className="space-y-4">
                {createdEvents.length > 0 ? (
                  <EventList 
                    events={createdEvents} 
                    emptyMessage="You haven't created any events yet" 
                  />
                ) : (
                  <div className="text-center p-8">
                    <h3 className="text-lg font-medium">You haven't created any events yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first event to share with others
                    </p>
                    <Button onClick={() => navigate('/add-event')}>
                      Create Event
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {attendingEvents.map((event: Event) => (
                  <EventCard 
                    key={event.id} 
                    event={event}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
