import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Event, EventCategory } from '@/types';
import { formatDistanceToNow, format, isValid } from 'date-fns';
import { 
  ArrowLeft, MapPin, Clock, Users, DollarSign, 
  CalendarIcon, Share2, Heart, CheckCircle, Shield, ChevronDown, ChevronUp
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import AttendeesList from '@/components/AttendeesList';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAttendeesOpen, setIsAttendeesOpen] = useState(false);

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
            isVerified: data.isVerified || false,
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString()
          };
          setEvent(typedEvent);
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

  const handleJoinEvent = () => {
    toast({
      title: "You're in!",
      description: "You've successfully joined this event.",
    });
  };

  const handlePayment = () => {
    toast({
      title: "Processing payment",
      description: "Taking you to the payment screen...",
    });
    // In a real app, this would open a payment form or redirect to payment processor
  };

  const handleShare = () => {
    if (!event) return;
    
    const shareUrl = `${window.location.origin}/event/${event.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: shareUrl,
      }).catch(error => {
        console.log('Error sharing', error);
        copyToClipboard(shareUrl);
      });
    } else {
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
      <AppLayout activeTab="events">
        <div className="p-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Event not found</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const startTime = new Date(event.time.start);
  const formattedDate = isValid(startTime) ? format(startTime, 'EEEE, MMMM d') : 'Date TBD';
  const formattedTime = isValid(startTime) ? format(startTime, 'h:mm a') : 'Time TBD';
  const timeUntil = isValid(startTime) ? formatDistanceToNow(startTime, { addSuffix: true }) : 'Time TBD';
  const isStartingSoon = isValid(startTime) && startTime.getTime() - new Date().getTime() < 60 * 60 * 1000; // 1 hour

  return (
    <AppLayout activeTab="events">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Event Details</h1>
        <div className="flex flex-col min-h-screen">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(-1)}
                  className="h-8 w-8"
                >
                  <ArrowLeft size={18} />
                </Button>
                <h1 className="text-lg font-medium truncate">Event Details</h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleShare}
              >
                <Share2 size={18} />
              </Button>
            </div>
          </div>

          <div className="flex-grow">
            <div className="relative h-56 sm:h-72 md:h-80 w-full">
              <img 
                src={event.images[0]} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur-sm border-0 text-white hover:bg-black/40 hover:text-white" onClick={handleShare}>
                  <Share2 size={16} />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur-sm border-0 text-white hover:bg-black/40 hover:text-white">
                  <Heart size={16} />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <div className="flex justify-between flex-wrap gap-2">
                  <Badge className="mb-2">{event.category}</Badge>
                  {isStartingSoon && (
                    <Badge className="bg-thrivvo-orange text-white border-0">
                      Starting Soon!
                    </Badge>
                  )}
                  {event.isVerified && (
                    <Badge className="bg-white border-thrivvo-orange text-thrivvo-orange mb-2">
                      <CheckCircle size={14} className="mr-1" /> Verified
                    </Badge>
                  )}
                  {(event.price && event.price.amount > 0) || event.monetized ? (
                    <Badge className="bg-white border-thrivvo-teal text-thrivvo-teal mb-2">
                      <DollarSign size={14} className="mr-1" /> Premium
                    </Badge>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{event.title}</h1>
                  {event.isVerified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CheckCircle size={20} className="text-thrivvo-orange" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <p className="font-semibold">Verified Event</p>
                            <p>This event has been confirmed as authentic by our team</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex items-center text-muted-foreground mt-1">
                  <Clock size={14} className="mr-1" />
                  <span>{timeUntil}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={event.host.avatar} />
                  <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <div>
                    <div className="font-medium">{event.host.name}</div>
                    <div className="text-sm text-muted-foreground">Host</div>
                  </div>
                  {event.host.verified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Shield className="ml-2 h-4 w-4 text-thrivvo-teal" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Verified Host</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              <Separator />

              {event.isVerified && (
                <>
                  <div className="bg-muted/30 p-3 rounded-md border border-muted flex items-start gap-3">
                    <div className="bg-thrivvo-orange/10 p-2 rounded-full">
                      <CheckCircle size={18} className="text-thrivvo-orange" />
                    </div>
                    <div>
                      <h3 className="font-medium">Verified Event</h3>
                      <p className="text-sm text-muted-foreground">
                        This event has been reviewed and confirmed by our trust & safety team, ensuring it's legitimate and as described.
                      </p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-md">
                    <CalendarIcon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{formattedTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-md">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{event.location.name}</p>
                    <p className="text-sm text-muted-foreground">{event.location.address}</p>
                    <p className="text-xs text-muted-foreground">{event.location.distance} miles away</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="font-medium mb-2">About this event</h2>
                <p className="text-muted-foreground">{event.description}</p>
              </div>

              <div>
                <Collapsible 
                  open={isAttendeesOpen} 
                  onOpenChange={setIsAttendeesOpen}
                  className="w-full"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-medium">Attendees</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users size={14} />
                        <span>{event.attendees.count}{event.attendees.max ? `/${event.attendees.max}` : ''}</span>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {isAttendeesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  
                  <div className="flex -space-x-2 mb-2">
                    {Array(Math.min(5, event.attendees.count)).fill(0).map((_, i) => (
                      <Avatar key={i} className="border-2 border-background h-8 w-8">
                        <AvatarFallback>{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {event.attendees.count > 5 && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                        +{event.attendees.count - 5}
                      </div>
                    )}
                  </div>
                  
                  <CollapsibleContent className="space-y-2 mt-2">
                    <AttendeesList eventId={eventId || ''} />
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <Separator />

              <div>
                <h2 className="font-medium mb-2">Vibe</h2>
                <div className="flex flex-wrap gap-2">
                  {event.vibe.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 p-4 bg-background/80 backdrop-blur-sm border-t">
            <div className="flex items-center justify-between">
              {event.price ? (
                <>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <div className="flex items-center font-semibold">
                      <DollarSign size={16} className="text-muted-foreground" />
                      {event.price.amount} {event.price.currency}
                    </div>
                  </div>
                  <Button 
                    onClick={handlePayment}
                    className="bg-thrivvo-teal hover:bg-thrivvo-teal/90"
                  >
                    Pay & Join
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">
                    Free Event
                  </div>
                  <Button 
                    onClick={handleJoinEvent}
                    className="bg-thrivvo-teal hover:bg-thrivvo-teal/90"
                  >
                    Join Event
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventDetail;
