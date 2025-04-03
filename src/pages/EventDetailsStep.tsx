
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EventForm from '@/components/EventDetails/EventForm';

const EventDetailsStep = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    type: '',
    name: '',
    description: '',
    location: '',
    date: ''
  });

  // Fetch existing event data from session storage
  useEffect(() => {
    const savedData = sessionStorage.getItem('newEventData');
    if (savedData) {
      setEventData(prevData => ({
        ...prevData,
        ...JSON.parse(savedData)
      }));
    } else {
      navigate('/add-event');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate(`/add-event/name?type=${eventData.type}`);
  };

  const handleNext = () => {
    // Save the complete event data to session storage
    sessionStorage.setItem('newEventData', JSON.stringify(eventData));
    navigate('/add-event/photos');
  };

  const handleChange = (field: string, value: string) => {
    setEventData(prev => {
      const updated = { ...prev, [field]: value };
      // Also save to session storage on each change for backup
      sessionStorage.setItem('newEventData', JSON.stringify(updated));
      return updated;
    });
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

        <EventForm 
          eventData={eventData}
          onDataChange={handleChange}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </AppLayout>
  );
};

export default EventDetailsStep;
