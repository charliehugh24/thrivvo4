
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { PartyPopper, MapPin, Clock, ArrowLeft, List } from 'lucide-react';
import EventList from '@/components/EventList';
import { mockEvents } from '@/data/mockData';

const PartyEvents = () => {
  const navigate = useNavigate();
  
  // Filter only party events
  const partyEvents = mockEvents.filter(event => event.category === 'party');
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "You're all set!",
      description: "Thanks for signing up for party events notifications!",
    });
  };
  
  return (
    <AppLayout activeTab="discover">
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="h-8 w-8"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PartyPopper className="text-thrivvo-teal" size={24} />
            Party Events
          </h1>
        </div>
        
        {/* Party Events List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming Party Events</h2>
          <EventList events={partyEvents} emptyMessage="No party events found" />
        </div>
        
        <Button 
          className="w-full bg-thrivvo-teal hover:bg-thrivvo-teal/90"
          onClick={() => navigate('/house-parties')}
        >
          <List className="mr-2" size={16} />
          View House Parties
        </Button>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1721322800607-8c38375eef04" 
              alt="House party" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
              alt="Outdoor event" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="bg-muted/40 rounded-xl p-4 space-y-4">
          <h3 className="font-medium">Sign up for Party Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Get notified when new parties are added near you or when your friends are going to events.
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

export default PartyEvents;
