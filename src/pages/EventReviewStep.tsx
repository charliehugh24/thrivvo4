
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const EventReviewStep = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    type: '',
    name: '',
    description: '',
    location: '',
    date: '',
    images: [] as string[]
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Load saved data from session storage
    const savedData = sessionStorage.getItem('newEventData');
    if (savedData) {
      setEventData(JSON.parse(savedData));
    } else {
      // If no data, go back to the start
      navigate('/add-event');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/add-event/photos');
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Clear the form data from session storage
      sessionStorage.removeItem('newEventData');
      
      toast({
        title: "Event created successfully!",
        description: "Your event has been submitted and is now live.",
      });
      
      setSubmitting(false);
      
      // Navigate back to home
      navigate('/');
    }, 1500);
  };

  return (
    <AppLayout activeTab="add">
      <div className="p-4 space-y-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Review Event</h1>
        </div>

        <p className="text-muted-foreground mb-4">
          Please review your event details before submitting.
        </p>

        <div className="space-y-6 bg-muted/30 p-4 rounded-lg">
          <h2 className="text-xl font-bold">{eventData.name}</h2>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
              {eventData.type.charAt(0).toUpperCase() + eventData.type.slice(1)}
            </span>
          </div>
          
          <p className="whitespace-pre-line">{eventData.description}</p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={16} className="mr-1" />
            <span>{eventData.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-1" />
            <span>{formatDate(eventData.date)}</span>
          </div>
          
          {eventData.images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Event Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {eventData.images.map((img, index) => (
                  <div key={index} className="rounded-md overflow-hidden aspect-square">
                    <img 
                      src={img} 
                      alt={`Event preview ${index + 1}`}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={submitting}
          >
            {submitting ? "Creating Event..." : "Submit Event"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventReviewStep;
