
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { Event } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface EventListProps {
  events: Event[];
  emptyMessage?: string;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  emptyMessage = "No events found" 
}) => {
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

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Link 
          key={event.id}
          to={`/event/${event.id}`}
          className="block"
        >
          <div className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              {event.isPremium && (
                <div className="absolute top-1 left-1">
                  <Badge variant="secondary" className="bg-thrivvo-teal text-white">
                    Premium
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base truncate">{event.title}</h3>
              
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarIcon size={12} />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <ClockIcon size={12} className="ml-1" />
                <span>{formatDistanceToNow(new Date(event.date))}</span>
              </div>
              
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPinIcon size={12} />
                <span className="truncate">{event.location}</span>
              </div>
              
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <UserIcon size={12} />
                <span>{event.attendees} attending</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EventList;
