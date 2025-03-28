
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Event } from '@/types';
import { mockEvents } from '@/data/mockData';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, MapPin, Clock, Users, DollarSign, CalendarIcon, Share2, Heart } from 'lucide-react';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to fetch event details
    const foundEvent = mockEvents.find(e => e.id === eventId);
    setEvent(foundEvent || null);
    setLoading(false);
  }, [eventId]);

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
        <div className="p-4 flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Back to Events</Button>
        </div>
      </AppLayout>
    );
  }

  const startTime = new Date(event.time.start);
  const formattedDate = format(startTime, 'EEEE, MMMM d');
  const formattedTime = format(startTime, 'h:mm a');
  const timeUntil = formatDistanceToNow(startTime, { addSuffix: true });
  const isStartingSoon = startTime.getTime() - new Date().getTime() < 60 * 60 * 1000; // 1 hour

  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen">
        {/* Back button and header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="h-8 w-8"
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-lg font-medium truncate">Event Details</h1>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow">
          {/* Cover image */}
          <div className="relative h-56 sm:h-72 md:h-80 w-full">
            <img 
              src={event.images[0]} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur-sm border-0 text-white hover:bg-black/40 hover:text-white">
                <Share2 size={16} />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-black/20 backdrop-blur-sm border-0 text-white hover:bg-black/40 hover:text-white">
                <Heart size={16} />
              </Button>
            </div>
          </div>

          {/* Event details */}
          <div className="p-4 space-y-4">
            {/* Title and category */}
            <div>
              <div className="flex justify-between">
                <Badge className="mb-2">{event.category}</Badge>
                {isStartingSoon && (
                  <Badge className="bg-thrivvo-orange text-white border-0">
                    Starting Soon!
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold">{event.title}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <Clock size={14} className="mr-1" />
                <span>{timeUntil}</span>
              </div>
            </div>

            {/* Host info */}
            <div className="flex items-center gap-3 py-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={event.host.avatar} />
                <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{event.host.name}</div>
                <div className="text-sm text-muted-foreground">Host</div>
              </div>
            </div>

            <Separator />

            {/* Date, time, location */}
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

            {/* Description */}
            <div>
              <h2 className="font-medium mb-2">About this event</h2>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            {/* Attendees */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-medium">Attendees</h2>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users size={14} />
                  <span>{event.attendees.count}{event.attendees.max ? `/${event.attendees.max}` : ''}</span>
                </div>
              </div>
              <div className="flex -space-x-2">
                {/* This would show actual attendee avatars in a real app */}
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
            </div>

            {/* Vibes/Tags */}
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

        {/* Action buttons */}
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
    </AppLayout>
  );
};

export default EventDetail;
