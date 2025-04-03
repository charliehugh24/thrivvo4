
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { List } from 'lucide-react';
import EventList from '@/components/EventList';
import { mockEvents } from '@/data/mockData';
import CategoryFilter from '@/components/CategoryFilter';
import { EventCategory } from '@/types';

const HouseParties = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>('party');
  
  // Filter events based on selected category
  const filteredEvents = selectedCategory 
    ? mockEvents.filter(event => event.category === selectedCategory)
    : mockEvents;
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "You're all set!",
      description: "Thanks for signing up for house parties notifications!",
    });
  };

  const handleCategorySelect = (category: EventCategory | null) => {
    setSelectedCategory(category);
  };
  
  // Determine the button text based on the selected category
  const getButtonText = () => {
    if (!selectedCategory) return "View All Events";
    
    switch(selectedCategory) {
      case 'party': return "View House Party Events";
      case 'sports': return "View Sports Events";
      case 'food': return "View Food Events";  
      default: return `View ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`;
    }
  };
  
  return (
    <AppLayout activeTab="discover">
      <div className="p-4 space-y-6">
        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />
        
        {/* Events List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events` : 'All Events'}
          </h2>
          <EventList 
            events={filteredEvents} 
            emptyMessage={`No ${selectedCategory || 'events'} found nearby`} 
          />
        </div>
        
        <Button 
          className="w-full bg-thrivvo-teal hover:bg-thrivvo-teal/90"
          onClick={() => navigate('/party-events')}
        >
          <List className="mr-2" size={16} />
          {getButtonText()}
        </Button>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1482575832494-771f74bf6857" 
              alt="House party" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7" 
              alt="Indoor party" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="bg-muted/40 rounded-xl p-4 space-y-4">
          <h3 className="font-medium">Sign up for House Party Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Never miss a house party in your area. Get notifications when new house parties are announced.
          </p>
          
          <form onSubmit={handleSignUp} className="space-y-3">
            <Input 
              type="email" 
              placeholder="Your email" 
              required 
              className="bg-background"
            />
            <div className="flex gap-2">
              <Input 
                type="tel" 
                placeholder="Phone (optional)" 
                className="bg-background"
              />
              <Button className="bg-thrivvo-teal hover:bg-thrivvo-teal/90" type="submit">
                Sign Up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default HouseParties;
