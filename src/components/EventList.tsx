
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, CheckCircle, DollarSign, Share2, X } from 'lucide-react';
import { Event } from '@/types';
import { formatDistanceToNow, isValid } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventListProps {
  events: Event[];
  emptyMessage?: string;
  showCancelOption?: boolean;
  onCancelEvent?: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  emptyMessage = "No events found",
  showCancelOption = false,
  onCancelEvent
}) => {
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [eventToCancel, setEventToCancel] = React.useState<Event | null>(null);

  if (events.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">{emptyMessage}</h3>
        <p className="text-muted-foreground">
          Try selecting a different category or check back later
        </p>
      </div>
    );
  }

  // Helper function to safely format time distance
  const formatTimeDistance = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Date unavailable';
    }
  };

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

  const confirmCancel = () => {
    if (eventToCancel && onCancelEvent) {
      onCancelEvent(eventToCancel.id);
      toast({
        title: "Event cancelled",
        description: `You have cancelled "${eventToCancel.title}"`,
      });
    }
    setCancelDialogOpen(false);
    setEventToCancel(null);
  };

  return (
    <div className="space-y-4">
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
            {showCancelOption && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full bg-background/80 hover:bg-destructive hover:text-white shadow-sm"
                onClick={(e) => handleCancelClick(event, e)}
              >
                <X size={14} />
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

      {/* Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel {eventToCancel?.title}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Event
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Cancel Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventList;
