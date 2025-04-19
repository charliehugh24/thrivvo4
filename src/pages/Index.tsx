import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AppLayout from '@/components/AppLayout';
import EventCard from '@/components/EventCard';
import EventList from '@/components/EventList';
import CategoryFilter from '@/components/CategoryFilter';
import { Event, EventCategory } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { LayoutList, LayoutGrid, CheckCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
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
    const fetchEvents = async () => {
      setLoading(true);
      try {
        console.log('Fetching events...');
        let query = supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (selectedCategory) {
          console.log('Filtering by category:', selectedCategory);
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Received data:', data);

        if (data && data.length > 0) {
          // Convert Supabase data to Event type
          const convertedEvents = data.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            category: event.category as EventCategory,
            location: event.location as Event['location'],
            time: event.time as Event['time'],
            host: event.host as Event['host'],
            attendees: event.attendees as Event['attendees'],
            price: event.price as Event['price'],
            images: event.images,
            vibe: event.vibe,
            isPrivate: event.isPrivate,
            isVerified: event.isVerified || false,
            monetized: event.monetized || false
          }));

          // Sort events by date
          const sortedEvents = convertedEvents.sort((a, b) => 
            new Date(b.time.start).getTime() - new Date(a.time.start).getTime()
          );

          console.log('Converted events:', sortedEvents);
          setMainEvent(sortedEvents[0]);
          setEvents(sortedEvents.slice(1));
        } else {
          console.log('No events found');
          setMainEvent(null);
          setEvents([]);
        }
      } catch (error) {
        console.error('Error in fetchEvents:', error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCategory]);

  const handleCategorySelect = (category: EventCategory | null) => {
    setSelectedCategory(category);
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events` : 'Discover Events'}
          </h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('card')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect}
        />
        
        {loading && (
          <div className="text-center py-4">
            <p>Loading events...</p>
          </div>
        )}
        
        {!loading && !mainEvent && events.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {selectedCategory 
                ? `No ${selectedCategory} events found. Be the first to create one!` 
                : 'No events found. Create an event to get started!'}
            </p>
            <Button 
              className="mt-4 bg-thrivvo-teal text-white"
              onClick={() => navigate('/add-event')}
            >
              Create Event
            </Button>
          </div>
        )}
        
        {!loading && mainEvent && (
          <div className="my-6">
            <h2 className="text-lg font-semibold mb-3">Featured Event</h2>
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-48">
                <img 
                  src={mainEvent.images[0] || '/placeholder-event.jpg'} 
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
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
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
        
        {!loading && events.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">More Events</h2>
            {viewMode === 'list' ? (
              <EventList events={events} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event}
                    onSwipeLeft={() => {}}
                    onSwipeRight={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
