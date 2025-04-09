
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, DollarSign, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types';

const EventReviewStep = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    type: '',
    name: '',
    description: '',
    location: '',
    date: '',
    images: [] as string[],
    isPaid: false,
    price: '',
    ticketLimit: '',
    salesDeadline: '',
    ticketType: '',
    paymentMethod: '',
    refundPolicy: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data from session storage
    const savedData = sessionStorage.getItem('newEventData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setEventData({
        ...parsedData,
        images: parsedData.images || [] // Ensure images is always an array
      });
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
    
    // Create an event object with the correct structure based on Event type
    const newEvent: Event = {
      id: `user-event-${Date.now()}`,
      title: eventData.name,
      description: eventData.description,
      category: eventData.type as any || 'other',
      location: {
        name: eventData.location,
        address: eventData.location,
        distance: 0
      },
      time: {
        start: eventData.date
      },
      host: {
        id: "user-1", // Current user ID
        name: "Alex Johnson", // Current user name
        verified: false,
        avatar: "/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png" // Current user avatar
      },
      attendees: {
        count: 1,
        max: eventData.ticketLimit ? parseInt(eventData.ticketLimit) : undefined
      },
      price: eventData.isPaid && eventData.price ? {
        amount: parseFloat(eventData.price),
        currency: "USD"
      } : undefined,
      images: eventData.images || [], // Ensure images is an array even if undefined
      vibe: [],
      isPrivate: false,
      monetized: eventData.isPaid || false // Add monetized flag based on isPaid
    };
    
    // Save to localStorage (get existing events first)
    const existingEvents = localStorage.getItem('userCreatedEvents');
    const userEvents = existingEvents ? JSON.parse(existingEvents) : [];
    userEvents.push(newEvent);
    localStorage.setItem('userCreatedEvents', JSON.stringify(userEvents));
    
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
          
          {eventData.isPaid && (
            <div className="space-y-2 border-t pt-3 mt-3">
              <h3 className="font-medium text-sm">Payment Details</h3>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign size={16} className="mr-1" />
                <span>${parseFloat(eventData.price || '0').toFixed(2)} per person</span>
              </div>
              
              {eventData.ticketLimit && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Ticket size={16} className="mr-1" />
                  <span>Limited to {eventData.ticketLimit} tickets</span>
                </div>
              )}
              
              {eventData.salesDeadline && (
                <div className="text-sm text-muted-foreground ml-5">
                  <span>Sales end: {
                    eventData.salesDeadline === '1hour' ? '1 hour before event' :
                    eventData.salesDeadline === '2hours' ? '2 hours before event' :
                    eventData.salesDeadline === '1day' ? '1 day before event' : 
                    'When event starts'
                  }</span>
                </div>
              )}
              
              {eventData.refundPolicy && (
                <div className="text-sm text-muted-foreground ml-5">
                  <span>Refund policy: {
                    eventData.refundPolicy === 'none' ? 'No refunds' :
                    eventData.refundPolicy === '24hours' ? 'Up to 24 hours before event' :
                    eventData.refundPolicy === '48hours' ? 'Up to 48 hours before event' : 
                    'Custom policy'
                  }</span>
                </div>
              )}
            </div>
          )}
          
          {eventData.images && eventData.images.length > 0 && (
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
