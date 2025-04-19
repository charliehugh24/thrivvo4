import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventList from '@/components/EventList';
import { MessageSquare, CalendarDays, Image, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Event, EventCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ProfileTabsProps {
  userName: string;
  isCurrentUser: boolean;
  userId?: string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  userName, 
  isCurrentUser,
  userId
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('hosted');
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchEvents = async () => {
    if (!user) return;

    try {
      // Fetch hosted events
      const { data: hostedData, error: hostedError } = await supabase
        .from('events')
        .select('*, host, attendees')
        .eq('host->>id', user.id)
        .order('created_at', { ascending: false });

      if (hostedError) throw hostedError;

      // Fetch attending events
      const { data: attendingData, error: attendingError } = await supabase
        .from('events')
        .select('*, host, attendees')
        .contains('attendees->ids', `["${user.id}"]`)
        .order('created_at', { ascending: false });

      if (attendingError) throw attendingError;

      // Debug logging
      console.log('Hosted events query:', {
        userId: user.id,
        query: `host->>id = ${user.id}`,
        resultCount: hostedData?.length || 0,
        events: hostedData
      });

      console.log('Attending events query:', {
        userId: user.id,
        query: `contains(attendees->ids, ["${user.id}"])`,
        resultCount: attendingData?.length || 0,
        events: attendingData
      });

      // Convert the data to match our Event type
      const typedHostedEvents = (hostedData || []).map(event => ({
        ...event,
        category: event.category as EventCategory,
        location: event.location as { name: string; address: string; distance: number },
        time: event.time as { start: string; end: string | null },
        host: event.host as { id: string; name: string; verified: boolean; avatar: string | null },
        attendees: event.attendees as { count: number; max: number | null; ids: string[] },
        price: event.price as { amount: number; currency: string } | null,
        images: event.images || [],
        vibe: event.vibe || [],
        monetized: event.monetized || false,
        created_at: event.created_at,
        updated_at: event.updated_at
      }));

      const typedAttendingEvents = (attendingData || []).map(event => ({
        ...event,
        category: event.category as EventCategory,
        location: event.location as { name: string; address: string; distance: number },
        time: event.time as { start: string; end: string | null },
        host: event.host as { id: string; name: string; verified: boolean; avatar: string | null },
        attendees: event.attendees as { count: number; max: number | null; ids: string[] },
        price: event.price as { amount: number; currency: string } | null,
        images: event.images || [],
        vibe: event.vibe || [],
        monetized: event.monetized || false,
        created_at: event.created_at,
        updated_at: event.updated_at
      }));

      setHostedEvents(typedHostedEvents);
      setAttendingEvents(typedAttendingEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
  };
  
  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };
  
  const handleEditClick = (eventId: string) => {
    navigate(`/edit-event/${eventId}`);
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setHostedEvents(prev => prev.filter(event => event.id !== eventId));
  };
  
  // Content for empty states
  const renderEmptyState = (icon: React.ReactNode, title: string, message: string) => (
    <div className="flex flex-col items-center justify-center text-center py-8 md:py-12 px-3 md:px-4">
      <div className="bg-muted rounded-full p-3 mb-3">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-medium mb-2">{title}</h3>
      <p className="text-xs md:text-sm text-muted-foreground max-w-md">{message}</p>
    </div>
  );

  if (loading && !refreshing) {
    return <div className="p-4">Loading events...</div>;
  }

  return (
    <Tabs defaultValue="hosted" className="w-full" onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hosted">Hosted Events</TabsTrigger>
          <TabsTrigger value="attending">Attending Events</TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      <TabsContent value="hosted">
        <EventList 
          events={hostedEvents} 
          emptyMessage="You haven't hosted any events yet"
          onDeleteEvent={handleDeleteEvent}
        />
      </TabsContent>
      <TabsContent value="attending">
        <EventList 
          events={attendingEvents} 
          emptyMessage="You aren't attending any events yet"
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
