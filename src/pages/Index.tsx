import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AppLayout from '@/components/AppLayout';
import EventCard from '@/components/EventCard';
import EventList from '@/components/EventList';
import CategoryFilter from '@/components/CategoryFilter';
import UsersNearby from '@/components/UsersNearby';
import { mockEvents, mockUsers } from '@/data/mockData';
import { Event, EventCategory } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { LayoutList, LayoutGrid, CheckCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

const Index = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [mainEvent, setMainEvent] = useState<Event | null>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const [userProfile, setUserProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data) {
          setUserProfile(data);
        }
      }
      setLoading(false);
    };
    
    fetchUserProfile();
  }, []);
  
  useEffect(() => {
    let filteredEvents = [...mockEvents];
    
    if (selectedCategory) {
      filteredEvents = filteredEvents.filter(event => event.category === selectedCategory);
    }
    
    if (userProfile?.interests && userProfile.interests.length > 0 && !selectedCategory) {
      filteredEvents = filteredEvents.filter(event => 
        userProfile.interests?.includes(event.category) || 
        event.vibe.some(v => userProfile.interests?.includes(v))
      );
    }
    
    if (userProfile?.distance_preference) {
      filteredEvents = filteredEvents.filter(event => 
        event.location.distance <= userProfile.distance_preference
      );
    }
    
    if (filteredEvents.length > 0) {
      setMainEvent(filteredEvents[0]);
      setEvents(filteredEvents.slice(1));
    } else {
      setMainEvent(null);
      setEvents([]);
    }
    
    setCurrentEventIndex(0);
  }, [selectedCategory, userProfile]);

  const handleCategorySelect = (category: EventCategory | null) => {
    if (category === 'party') {
      navigate('/house-parties');
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSwipeLeft = () => {
    toast({
      description: "Not interested. Maybe next time!",
      variant: "destructive",
    });
    
    if (currentEventIndex < events.length - 1) {
      setTimeout(() => {
        setCurrentEventIndex(prev => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        toast({
          title: "That's all for now!",
          description: "Check back later for more events",
        });
      }, 500);
    }
  };

  const handleSwipeRight = () => {
    // We don't need to do anything here since the navigation happens in EventCard
    // Just leave this as a callback for the EventCard component
  };

  const handleTabChange = (value: string) => {
    if (value === "search") {
      navigate("/search");
    }
  };

  const hasMoreEvents = currentEventIndex < events.length - 1;

  return (
    <AppLayout activeTab="discover" onTabChange={handleTabChange}>
      <div className="p-4 space-y-6">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect}
        />
        
        {loading && (
          <div className="text-center py-4">
            <p>Loading your personalized events...</p>
          </div>
        )}
        
        {!loading && mainEvent && (
          <div className="my-6">
            <h2 className="text-lg font-semibold mb-3">Featured Event</h2>
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-48">
                <img 
                  src={mainEvent.images[0]} 
                  alt={mainEvent.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <Badge variant="secondary" className="bg-thrivvo-teal text-white">
                    {mainEvent.category}
                  </Badge>
                  
                  {mainEvent.isVerified && (
                    <Badge variant="outline" className="bg-white/80 text-thrivvo-orange border-thrivvo-orange">
                      <CheckCircle size={12} className="mr-1" /> Verified
                    </Badge>
                  )}
                  
                  {(mainEvent.price && mainEvent.price.amount > 0) || mainEvent.monetized ? (
                    <Badge variant="outline" className="bg-white/80 border-thrivvo-teal text-thrivvo-teal">
                      <DollarSign size={12} className="mr-1" /> Premium
                    </Badge>
                  ) : null}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{mainEvent.title}</h3>
                  {mainEvent.isVerified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CheckCircle size={18} className="text-thrivvo-orange" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This event has been verified by our team</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{mainEvent.description}</p>
                <div className="flex items-center mt-3 text-sm text-muted-foreground">
                  <span>{new Date(mainEvent.time.start).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                  <span className="mx-2">•</span>
                  <span>{mainEvent.location.name}</span>
                  <span className="mx-2">•</span>
                  <span>{mainEvent.location.distance} miles away</span>
                </div>
                <Button 
                  className="w-full mt-3 bg-thrivvo-teal text-white"
                  onClick={() => navigate(`/event/${mainEvent.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">
              {!loading && userProfile?.interests && userProfile.interests.length > 0 && !selectedCategory 
                ? 'Events Based on Your Interests' 
                : 'More Events'}
            </h2>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={viewMode === 'card' ? 'bg-muted' : ''}
                onClick={() => setViewMode('card')}
              >
                <LayoutGrid size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={viewMode === 'list' ? 'bg-muted' : ''}
                onClick={() => setViewMode('list')}
              >
                <LayoutList size={18} />
              </Button>
            </div>
          </div>
          
          <div className="min-h-[200px]">
            {events.length > 0 ? (
              <>
                {viewMode === 'card' ? (
                  <div className="w-full mb-8">
                    {events[currentEventIndex] && (
                      <EventCard 
                        event={events[currentEventIndex]} 
                        onSwipeLeft={handleSwipeLeft} 
                        onSwipeRight={handleSwipeRight} 
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full">
                    <EventList events={events} />
                  </div>
                )}
                
                {viewMode === 'card' && !hasMoreEvents && currentEventIndex === events.length - 1 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Last event in this category. Swipe to see a summary.
                  </p>
                )}
              </>
            ) : (
              <div className="text-center p-8">
                <h3 className="text-lg font-medium">
                  {!loading && userProfile?.distance_preference 
                    ? `No events found within ${userProfile.distance_preference} miles`
                    : 'No events found'}
                </h3>
                <p className="text-muted-foreground">
                  Try selecting a different category, increasing your distance preference, or check back later
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Connect with Others</h2>
          <UsersNearby users={mockUsers} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
