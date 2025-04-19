import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, DollarSign, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const EventReviewStep = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an event.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // First, check if the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking profile:', profileError);
        throw profileError;
      }

      // If no profile exists, create one
      if (!profile) {
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || 'Anonymous',
            avatar_url: user.user_metadata?.avatar_url || null,
            updated_at: new Date().toISOString()
          });

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
          throw createProfileError;
        }
      }

      // Create an event object with the correct structure for Supabase
      const newEvent = {
        title: eventData.name || 'Untitled Event',
        description: eventData.description || 'No description provided',
        category: eventData.type || 'other',
        location: {
          name: eventData.location || 'Location not specified',
          address: eventData.location || 'Address not specified',
          distance: 0
        },
        time: {
          start: eventData.date || new Date().toISOString(),
          end: null
        },
        host: {
          id: user.id,
          name: user.user_metadata?.full_name || 'Anonymous',
          verified: false,
          avatar: user.user_metadata?.avatar_url || null
        },
        attendees: {
          count: 0,
          max: eventData.ticketLimit ? parseInt(eventData.ticketLimit) : null,
          ids: []
        },
        price: eventData.isPaid && eventData.price ? {
          amount: parseFloat(eventData.price),
          currency: "USD"
        } : null,
        images: eventData.images || [],
        vibe: [],
        monetized: eventData.isPaid || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Creating event with data:', JSON.stringify(newEvent, null, 2));
      
      // Save to Supabase with proper error handling
      const { data, error } = await supabase
        .from('events')
        .insert(newEvent)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from event creation');
      }
      
      console.log('Event created successfully:', data);
      
      // Verify the event was created by fetching it
      const { data: verifyData, error: verifyError } = await supabase
        .from('events')
        .select('*')
        .eq('id', data.id)
        .single();
      
      if (verifyError) {
        console.error('Error verifying event creation:', verifyError);
      } else {
        console.log('Verified event data:', verifyData);
      }
      
      // Clear the form data from session storage
      sessionStorage.removeItem('newEventData');
      
      // Show success message
      toast({
        title: "Event Created",
        description: "Your event has been created successfully!",
      });
      
      // Navigate to the profile page instead of the event page
      navigate('/profile');
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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
