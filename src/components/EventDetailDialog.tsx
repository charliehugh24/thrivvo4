
import React from 'react';
import { Event } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { MapPin, Clock, Users, DollarSign, Check, Calendar, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface EventDetailDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventDetailDialog: React.FC<EventDetailDialogProps> = ({ 
  event, 
  open, 
  onOpenChange 
}) => {
  if (!event) return null;
  
  const handleRSVP = () => {
    toast({
      title: "You're going!",
      description: `You've successfully RSVP'd to ${event.title}`,
    });
    onOpenChange(false);
  };

  const handleShare = () => {
    toast({
      title: "Link copied!",
      description: "Event link copied to clipboard",
    });
  };

  const startTime = new Date(event.time.start);
  const endTime = event.time.end ? new Date(event.time.end) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-1 text-sm">
            <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
            {event.location.name} • {event.location.distance}mi away
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image gallery */}
          <div className="aspect-video bg-muted rounded-md overflow-hidden">
            <img 
              src={event.images[0]} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Event details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-xs text-muted-foreground">Date & Time</div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-sm">{format(startTime, 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm">
                  {format(startTime, 'h:mm a')}
                  {endTime && ` - ${format(endTime, 'h:mm a')}`}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="text-xs text-muted-foreground">Attendees</div>
              <div className="flex items-center gap-1.5">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-sm">
                  {event.attendees.count}{event.attendees.max ? `/${event.attendees.max}` : ''}
                </span>
              </div>
              {event.price && (
                <div className="flex items-center gap-1.5">
                  <DollarSign size={16} className="text-muted-foreground" />
                  <span className="text-sm">${event.price.amount}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Host info */}
          <div className="flex items-center gap-3 border rounded-lg p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={event.host.avatar} />
              <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{event.host.name}</span>
                {event.host.verified && (
                  <Check size={16} className="text-thrivvo-teal" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">Host</span>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium mb-1">About this event</h4>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
          
          {/* Vibes */}
          <div>
            <h4 className="text-sm font-medium mb-1">Vibes</h4>
            <div className="flex flex-wrap gap-1.5">
              {event.vibe.map((vibe, index) => (
                <Badge key={index} variant="outline" className="text-xs font-normal">
                  {vibe}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={handleShare}
          >
            <Share2 size={18} />
          </Button>
          <Button 
            className="flex-1 bg-thrivvo-teal hover:bg-thrivvo-teal/90"
            onClick={handleRSVP}
          >
            I'm In!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
