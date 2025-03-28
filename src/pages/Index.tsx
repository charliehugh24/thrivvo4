
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
import { LayoutList, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  
  // Handle category selection and navigate if it's "party"
  const handleCategorySelect = (category: EventCategory | null) => {
    if (category === 'party') {
      navigate('/house-parties');
    } else {
      setSelectedCategory(category);
    }
  };
  
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
    // We don't need to do anything here since the navigation happens in EventCard
    // Just leave this as a callback for the EventCard component
  };

  const handleTabChange = (value: string) => {
    if (value === "search") {
      navigate("/search");
    }
  };

  const currentEvent = events[currentEventIndex];
  const hasMoreEvents = currentEventIndex < events.length - 1;

  return (
    <AppLayout activeTab="discover" onTabChange={handleTabChange}>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect}
          />
          
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
        
        <div className="min-h-[450px] flex flex-col items-center justify-center">
          {events.length > 0 ? (
            <>
              {viewMode === 'card' ? (
                <div className="w-full mb-8">
                  {currentEvent && (
                    <EventCard 
                      event={currentEvent} 
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
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground">
                Try selecting a different category or check back later
              </p>
            </div>
          )}
        </div>
        
        <UsersNearby users={mockUsers} />
      </div>
    </AppLayout>
  );
};

export default Index;
