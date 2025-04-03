
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EventDetailsStep = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    type: '',
    name: '',
    description: '',
    location: '',
    date: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data from session storage
    const savedData = sessionStorage.getItem('newEventData');
    if (savedData) {
      setEventData(prevData => ({
        ...prevData,
        ...JSON.parse(savedData)
      }));
    } else {
      // If no data, go back to the start
      navigate('/add-event');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate(`/add-event/name?type=${eventData.type}`);
  };

  const handleNext = () => {
    // Validate required fields
    if (!eventData.description || !eventData.location || !eventData.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive",
      });
      return;
    }

    // Save the updated data
    sessionStorage.setItem('newEventData', JSON.stringify(eventData));
    
    // Go to the photos step
    navigate('/add-event/photos');
  };

  const handleChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AppLayout activeTab="add">
      <div className="p-4 space-y-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Event Details</h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <Textarea 
              placeholder="Describe your event" 
              rows={4}
              value={eventData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Location</label>
            <Input 
              placeholder="Event location" 
              value={eventData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Date & Time</label>
            <Input 
              type="datetime-local" 
              value={eventData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleNext} className="w-full">
              Continue to Photos
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventDetailsStep;
