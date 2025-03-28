
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Home, MapPin, Clock, ArrowLeft, List } from 'lucide-react';
import EventList from '@/components/EventList';
import { mockEvents } from '@/data/mockData';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HouseParties = () => {
  const navigate = useNavigate();
  
  // Filter only house party events
  const housePartyEvents = mockEvents.filter(event => 
    event.title.toLowerCase().includes('house') || 
    event.description.toLowerCase().includes('house party')
  );
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "You're all set!",
      description: "Thanks for signing up for house parties notifications!",
    });
  };

  const handleTabChange = (value: string) => {
    if (value === "house-parties") {
      navigate('/house-parties');
    } else if (value === "night-clubs") {
      navigate('/party-events'); // We'll use party events for now
    } else if (value === "bars") {
      navigate('/party-events'); // We'll use party events for now  
    } else if (value === "hangouts") {
      navigate('/party-events'); // We'll use party events for now
    }
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
            <Home className="text-thrivvo-teal" size={24} />
            House Parties
          </h1>
        </div>

        {/* Event Type Navigation Tabs */}
        <Tabs defaultValue="house-parties" onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="house-parties" className="flex-1">
              House Parties
            </TabsTrigger>
            <TabsTrigger value="night-clubs" className="flex-1">
              Night Clubs
            </TabsTrigger>
            <TabsTrigger value="bars" className="flex-1">
              Bars
            </TabsTrigger>
            <TabsTrigger value="hangouts" className="flex-1">
              Hangouts
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* House Party Events List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming House Parties</h2>
          <EventList 
            events={housePartyEvents} 
            emptyMessage="No house parties found nearby" 
          />
        </div>
        
        <Button 
          className="w-full bg-thrivvo-teal hover:bg-thrivvo-teal/90"
          onClick={() => navigate('/party-events')}
        >
          <List className="mr-2" size={16} />
          View Party Events
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
