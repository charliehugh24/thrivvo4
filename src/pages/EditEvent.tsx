import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Event, EventCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import EventForm from '@/components/EventDetails/EventForm';

interface FormData {
  type: string;
  name: string;
  description: string;
  location: string;
  date: string;
  isPaid: boolean;
  price: string;
  ticketLimit: string;
  images: string[];
}

const EditEvent = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    type: '',
    name: '',
    description: '',
    location: '',
    date: '',
    isPaid: false,
    price: '',
    ticketLimit: '',
    images: []
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) {
          console.error('Error fetching event:', error);
          toast({
            title: "Error",
            description: "Failed to load event details. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        if (data) {
          // Convert the data to match our Event type
          const typedEvent: Event = {
            ...data,
            category: data.category as EventCategory,
            location: data.location as { name: string; address: string; distance: number },
            time: data.time as { start: string; end: string | null },
            host: data.host as { id: string; name: string; verified: boolean; avatar: string | null },
            attendees: {
              count: (data.attendees as any).count || 0,
              max: (data.attendees as any).max || null,
              ids: (data.attendees as any).ids || []
            },
            price: data.price as { amount: number; currency: string } | null,
            images: data.images || [],
            vibe: data.vibe || [],
            monetized: data.monetized || false,
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString()
          };
          setEvent(typedEvent);
          
          // Initialize form data
          setFormData({
            type: typedEvent.category,
            name: typedEvent.title,
            description: typedEvent.description,
            location: typedEvent.location.name,
            date: typedEvent.time.start,
            isPaid: typedEvent.monetized || false,
            price: typedEvent.price?.amount.toString() || '',
            ticketLimit: typedEvent.attendees.max?.toString() || '',
            images: typedEvent.images || []
          });
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "Error",
          description: "Failed to load event details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, toast]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDataChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user || !event) return;

    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: formData.name,
          description: formData.description,
          category: formData.type,
          location: {
            name: formData.location,
            address: formData.location,
            distance: 0
          },
          time: {
            start: formData.date,
            end: null
          },
          attendees: {
            count: event.attendees.count,
            max: formData.ticketLimit ? parseInt(formData.ticketLimit) : null,
            ids: event.attendees.ids
          },
          price: formData.isPaid && formData.price ? {
            amount: parseFloat(formData.price),
            currency: "USD"
          } : null,
          images: event.images,
          monetized: formData.isPaid || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', event.id);

      if (error) {
        console.error('Error updating event:', error);
        toast({
          title: "Error",
          description: "Failed to update event. Please try again later.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Event updated successfully!",
      });

      navigate(`/event/${event.id}`);
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again later.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 flex justify-center items-center min-h-[50vh]">
          <p>Loading event details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!event) {
    return (
      <AppLayout>
        <div className="p-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Event not found</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeTab="events">
      <div className="p-4 space-y-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Event</h1>
        </div>

        <EventForm 
          eventData={formData}
          onDataChange={handleDataChange}
          onBack={handleBack}
          onNext={handleSubmit}
        />
      </div>
    </AppLayout>
  );
};

export default EditEvent; 