
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EventNameStep = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventType = searchParams.get('type') || '';
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleBack = () => {
    navigate('/add-event');
  };

  const handleNext = () => {
    if (!name.trim()) {
      toast({
        title: "Event name required",
        description: "Please enter a name for your event",
        variant: "destructive",
      });
      return;
    }

    // Store the name in session storage to persist between steps
    const eventData = {
      type: eventType,
      name: name.trim()
    };
    sessionStorage.setItem('newEventData', JSON.stringify(eventData));

    // Navigate to the next step
    navigate('/add-event/details');
  };

  return (
    <AppLayout activeTab="add">
      <div className="p-4 space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Name Your Event</h1>
        </div>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">Choose a clear, descriptive name for your event to attract attendees.</p>
          
          <Input 
            placeholder="Event name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg"
            autoFocus
          />
          
          <div className="pt-4">
            <Button onClick={handleNext} className="w-full">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventNameStep;
