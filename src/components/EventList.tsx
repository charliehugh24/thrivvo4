import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, CheckCircle, DollarSign, Share2, X, Trash2 } from 'lucide-react';
import { Event, EventCategory } from '@/types';
import { formatDistanceToNow, isValid } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTimeDistance } from '@/lib/utils';

interface EventListProps {
  type: 'hosted' | 'attending';
  onCancelEvent?: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({ 
  type,
  onCancelEvent
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [eventToCancel, setEventToCancel] = React.useState<Event | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState<Event | null>(null);
  const [events, setEvents] = React.useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('events')
        .select('*');

      if (type === 'hosted') {
        query = query.eq('host->>id', user.id);
      } else if (type === 'attending') {
        // First get the event IDs from the event_attendees table
        const { data: attendingData } = await supabase
          .from('events')
          .select('id')
          .contains('attendees->ids', [user.id]);

        if (attendingData && attendingData.length > 0) {
          const eventIds = attendingData.map(event => event.id);
          query = query.in('id', eventIds);
        } else {
          setEvents([]);
          return;
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      // Convert the data to match our Event type
      const typedEvents = (data || []).map(event => {
        const eventAttendees = event.attendees as { ids: string[]; count: number; max: number | null };
        return {
          id: event.id,
          title: event.title,
          description: event.description,
          category: event.category as EventCategory,
          location: event.location as { name: string; address: string; distance: number },
          time: event.time as { start: string; end: string | null },
          host: event.host as { id: string; name: string; verified: boolean; avatar: string | null },
          attendees: {
            count: eventAttendees.count || 0,
            max: eventAttendees.max || null,
            ids: eventAttendees.ids || []
          },
          price: event.price as { amount: number; currency: string } | null,
          images: event.images || [],
          vibe: event.vibe || [],
          monetized: event.monetized || false,
          isVerified: event.isVerified || false,
          created_at: event.created_at || new Date().toISOString(),
          updated_at: event.updated_at || new Date().toISOString()
        };
      });
      
      setEvents(typedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [type]);

  if (events.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">No events found</h3>
        <p className="text-muted-foreground">
          Try selecting a different category or check back later
        </p>
      </div>
    );
  }

  const handleShare = (event: Event, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Create the share URL
    const shareUrl = `${window.location.origin}/event/${event.id}`;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: shareUrl,
      }).catch(error => {
        console.log('Error sharing', error);
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link copied!",
        description: "Event link copied to clipboard",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleCancelClick = (event: Event, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEventToCancel(event);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!eventToCancel || !user) return;

    try {
      // Get current event data
      const { data: currentEvent, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventToCancel.id)
        .single();

      if (fetchError) throw fetchError;

      const eventAttendees = currentEvent.attendees as { ids: string[]; count: number; max: number | null };
      // Remove user from attendees
      const updatedIds = eventAttendees.ids.filter(id => id !== user.id);
      const updatedCount = eventAttendees.count - 1;

      const { error: updateError } = await supabase
        .from('events')
        .update({
          attendees: {
            ids: updatedIds,
            count: updatedCount,
            max: eventAttendees.max
          }
        })
        .eq('id', eventToCancel.id);

      if (updateError) throw updateError;

      toast({
        title: "Attendance cancelled",
        description: `You are no longer attending "${eventToCancel.title}"`,
      });

      if (onCancelEvent) {
        onCancelEvent(eventToCancel.id);
      }
    } catch (error) {
      console.error('Error cancelling attendance:', error);
      toast({
        title: "Error",
        description: "Failed to cancel attendance. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setCancelDialogOpen(false);
      setEventToCancel(null);
    }
  };

  const handleDeleteClick = async (event: Event, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete || !user) return;

    try {
      console.log('Attempting to delete event:', {
        eventId: eventToDelete.id,
        userId: user.id,
        hostId: eventToDelete.host.id
      });

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventToDelete.id)
        .eq('host->>id', user.id);

      if (error) {
        console.error('Delete error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      toast({
        title: "Event deleted",
        description: `You have deleted "${eventToDelete.title}"`,
      });

      // Refresh the events list
      await fetchEvents();

      if (onCancelEvent) {
        onCancelEvent(eventToDelete.id);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="relative">
            <Link 
              to={`/event/${event.id}`}
              className="block"
            >
              <div className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
                  <img 
                    src={event.images[0]} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 flex flex-col gap-1">
                    {(event.price && event.price.amount > 0) || event.monetized ? (
                      <Badge variant="secondary" className="bg-thrivvo-teal text-white">
                        <DollarSign size={12} className="mr-1" /> Premium
                      </Badge>
                    ) : null}
                    
                    {event.isVerified && (
                      <Badge variant="outline" className="bg-white/90 text-thrivvo-orange border-thrivvo-orange">
                        <CheckCircle size={12} className="mr-1 text-thrivvo-orange" /> Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-base truncate">{event.title}</h3>
                    {event.isVerified && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CheckCircle size={16} className="text-thrivvo-orange" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified event</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarIcon size={12} />
                    <span>
                      {event.time && event.time.start ? new Date(event.time.start).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Date TBD'}
                    </span>
                    <ClockIcon size={12} className="ml-1" />
                    <span>
                      {event.time && event.time.start ? formatTimeDistance(event.time.start) : 'Time TBD'}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPinIcon size={12} />
                    <span className="truncate">{event.location.name}</span>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <UserIcon size={12} />
                    <span>{event.attendees.count} attending</span>
                  </div>
                </div>
              </div>
            </Link>
            <div className="absolute top-2 right-2 flex space-x-1">
              {user && event.attendees.ids.includes(user.id) && event.host.id !== user.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full bg-background/80 hover:bg-destructive hover:text-white shadow-sm"
                  onClick={(e) => handleCancelClick(event, e)}
                >
                  <X size={14} />
                </Button>
              )}
              {user && event.host.id === user.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full bg-background/80 hover:bg-destructive hover:text-white shadow-sm"
                  onClick={(e) => handleDeleteClick(event, e)}
                >
                  <Trash2 size={14} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-background/80 hover:bg-background shadow-sm"
                onClick={(e) => handleShare(event, e)}
              >
                <Share2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Attendance Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Attendance</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your attendance to {eventToCancel?.title}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Attending
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Cancel Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Event Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {eventToDelete?.title}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Keep Event
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventList;
