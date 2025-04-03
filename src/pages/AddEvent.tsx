
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MusicIcon, Mic, Users, PartyPopper } from 'lucide-react';

const AddEvent = () => {
  const navigate = useNavigate();

  const eventTypes = [
    { 
      id: 'concert', 
      name: 'Concert / Music Event', 
      icon: <MusicIcon className="h-8 w-8" />, 
      description: 'Live music performances, DJ sets, or concerts' 
    },
    { 
      id: 'social', 
      name: 'Social Gathering', 
      icon: <Users className="h-8 w-8" />, 
      description: 'Meetups, networking events, or casual get-togethers' 
    },
    { 
      id: 'party', 
      name: 'Party', 
      icon: <PartyPopper className="h-8 w-8" />, 
      description: 'House parties, nightclub events, or celebrations' 
    },
    { 
      id: 'exhibition', 
      name: 'Exhibition / Show', 
      icon: <Mic className="h-8 w-8" />, 
      description: 'Art exhibitions, performances, or cultural shows' 
    },
  ];

  const handleSelectEventType = (eventType: string) => {
    // Navigate to the next step with the selected event type
    navigate(`/add-event/details?type=${eventType}`);
  };

  return (
    <AppLayout activeTab="add">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">What type of event are you creating?</h1>
        <p className="text-muted-foreground">Select the category that best describes your event.</p>
        
        <div className="grid grid-cols-1 gap-4 mt-4">
          {eventTypes.map((type) => (
            <Card 
              key={type.id} 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleSelectEventType(type.id)}
            >
              <CardContent className="flex items-center p-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  {type.icon}
                </div>
                <div>
                  <h3 className="font-medium">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AddEvent;
