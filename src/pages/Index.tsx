
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import EventCard from '@/components/EventCard';
import CategoryFilter from '@/components/CategoryFilter';
import EventDetailDialog from '@/components/EventDetailDialog';
import UsersNearby from '@/components/UsersNearby';
import { mockEvents, mockUsers } from '@/data/mockData';
import { Event, EventCategory } from '@/types';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter events based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = mockEvents.filter(event => event.category === selectedCategory);
      setEvents(filtered);
    } else {
      setEvents(mockEvents);
    }
    setCurrentEventIndex(0);
  }, [selectedCategory]);

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
      // No more events
      setTimeout(() => {
        toast({
          title: "That's all for now!",
          description: "Check back later for more events",
        });
      }, 500);
    }
  };

  const handleSwipeRight = () => {
    const event = events[currentEventIndex];
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const currentEvent = events[currentEventIndex];
  const hasMoreEvents = currentEventIndex < events.length - 1;

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <div className="min-h-[450px] flex flex-col items-center justify-center">
          {events.length > 0 ? (
            <>
              <div className="w-full mb-8">
                {currentEvent && (
                  <EventCard 
                    event={currentEvent} 
                    onSwipeLeft={handleSwipeLeft} 
                    onSwipeRight={handleSwipeRight} 
                  />
                )}
              </div>
              
              {!hasMoreEvents && currentEventIndex === events.length - 1 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Last event in this category. Swipe to see a summary.
                </p>
              )}
            </>
          ) : (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground">
                Try selecting a different category or check back later
              </p>
            </div>
          )}
        </div>
        
        <UsersNearby users={mockUsers} />
      </div>
      
      <EventDetailDialog 
        event={selectedEvent} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </AppLayout>
  );
};

export default Index;
