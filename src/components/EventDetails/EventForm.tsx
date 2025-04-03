
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import LocationSearch from './LocationSearch';
import { useToast } from '@/hooks/use-toast';

interface EventData {
  type: string;
  name: string;
  description: string;
  location: string;
  date: string;
}

interface EventFormProps {
  eventData: EventData;
  onDataChange: (field: string, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ eventData, onDataChange, onBack, onNext }) => {
  const { toast } = useToast();

  const handleNext = () => {
    if (!eventData.description || !eventData.location || !eventData.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }

    onNext();
  };

  // Make sure location changes are properly handled
  const handleLocationChange = (location: string) => {
    onDataChange('location', location);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Describe your event" 
          rows={4}
          value={eventData.description}
          onChange={(e) => onDataChange('description', e.target.value)}
        />
      </div>

      <LocationSearch 
        location={eventData.location}
        onLocationChange={handleLocationChange}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium">Date & Time</label>
        <Input 
          type="datetime-local" 
          value={eventData.date}
          onChange={(e) => onDataChange('date', e.target.value)}
        />
      </div>

      <div className="pt-4">
        <Button onClick={handleNext} className="w-full">
          Continue to Photos
        </Button>
      </div>
    </div>
  );
};

export default EventForm;
