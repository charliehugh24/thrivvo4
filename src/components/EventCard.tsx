
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, Users, DollarSign, Check } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSwipeLeft, onSwipeRight }) => {
  const navigate = useNavigate();
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
  };

  const handleTouchEnd = () => {
    if (startX === null || currentX === null) return;
    
    const deltaX = currentX - startX;
    
    if (Math.abs(deltaX) > 100) {
      if (deltaX > 0) {
        setSwipeDirection('right');
        
        // Navigate to event detail page instead of opening dialog
        setTimeout(() => {
          onSwipeRight(); // Call the original handler for any cleanup needed
          navigate(`/event/${event.id}`);
        }, 300);
      } else {
        setSwipeDirection('left');
        onSwipeLeft();
      }
      
      // Reset after animation completes
      setTimeout(() => {
        setStartX(null);
        setCurrentX(null);
        setSwipeDirection(null);
      }, 500);
    } else {
      setStartX(null);
      setCurrentX(null);
    }
  };
  
  const getCardStyle = () => {
    if (startX === null || currentX === null) return {};
    
    const deltaX = currentX - startX;
    const rotate = deltaX * 0.1; // Adjust rotation based on swipe distance
    
    if (swipeDirection === 'left') {
      return { animation: 'swipe-left 0.5s forwards' };
    }
    
    if (swipeDirection === 'right') {
      return { animation: 'swipe-right 0.5s forwards' };
    }
    
    return {
      transform: `translateX(${deltaX}px) rotate(${rotate}deg)`,
      transition: 'transform 0.1s',
    };
  };

  const startTime = new Date(event.time.start);
  const timeUntil = formatDistanceToNow(startTime, { addSuffix: true });
  const isStartingSoon = new Date(event.time.start).getTime() - new Date().getTime() < 60 * 60 * 1000; // 1 hour

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div 
        className="event-card"
        ref={cardRef}
        style={getCardStyle()}
      >
        <Card className="overflow-hidden border-2 border-muted shadow-lg">
          <div className="relative h-60 w-full overflow-hidden">
            <img 
              src={event.images[0]} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm border-0">
                {timeUntil}
              </Badge>
              {isStartingSoon && (
                <Badge className="bg-thrivvo-orange text-white border-0">
                  Starting Soon!
                </Badge>
              )}
            </div>
            
            <div className="absolute top-3 right-3">
              <Badge className="bg-black/70 text-white backdrop-blur-sm border-0">
                {event.category}
              </Badge>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
              <div className="flex items-center text-white/90 text-sm gap-2">
                <MapPin size={14} />
                <span>{event.location.name} • {event.location.distance}mi</span>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={event.host.avatar} />
                  <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{event.host.name}</span>
                    {event.host.verified && (
                      <Check size={14} className="text-thrivvo-teal" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">Host</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-sm">
                  {event.attendees.count}{event.attendees.max ? `/${event.attendees.max}` : ''}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {event.description}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {event.vibe.slice(0, 3).map((vibe, index) => (
                  <Badge key={index} variant="outline" className="text-xs font-normal">
                    {vibe}
                  </Badge>
                ))}
              </div>
              
              {event.price && (
                <div className="flex items-center gap-1 text-sm font-medium">
                  <DollarSign size={14} className="text-muted-foreground" />
                  {event.price.amount} {event.price.currency}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Overlay for touch events */}
        <div 
          className="card-swipe-controller"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        />
      </div>
      
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-4 z-20 pointer-events-none">
        <div className={`p-3 rounded-full bg-destructive text-white shadow-lg ${swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </div>
        <div className={`p-3 rounded-full bg-thrivvo-teal text-white shadow-lg ${swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
