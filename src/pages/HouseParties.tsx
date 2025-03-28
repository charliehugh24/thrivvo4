
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EventList from '@/components/EventList';
import { mockEvents } from '@/data/mockData';

const HouseParties = () => {
  const navigate = useNavigate();
  
  // Filter only house party events
  const housePartyEvents = mockEvents.filter(event => 
    event.title.toLowerCase().includes('house') || 
    event.description.toLowerCase().includes('house party')
  );
  
  return (
    <AppLayout activeTab="discover">
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/party-events')}
            className="h-8 w-8"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">House Parties</h1>
        </div>
        
        <div className="space-y-4">
          <EventList 
            events={housePartyEvents} 
            emptyMessage="No house parties found nearby" 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default HouseParties;
