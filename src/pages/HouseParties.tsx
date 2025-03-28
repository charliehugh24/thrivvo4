
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';
import { mockEvents } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Calendar, Clock, Users, ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const HouseParties = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter for house parties only (assuming 'party' category represents house parties)
  const houseParties = mockEvents.filter(event => 
    event.category === 'party' && 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <AppLayout activeTab="discover">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="h-8 w-8"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">House Parties</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search house parties..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {houseParties.length > 0 ? (
            houseParties.map((event) => {
              const startTime = new Date(event.time.start);
              const timeUntil = formatDistanceToNow(startTime, { addSuffix: true });
              const isStartingSoon = startTime.getTime() - new Date().getTime() < 60 * 60 * 1000; // 1 hour
              
              return (
                <Card 
                  key={event.id} 
                  className="overflow-hidden border cursor-pointer hover:border-thrivvo-teal transition-colors"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="flex h-32 sm:h-36">
                    <div className="w-1/3 relative">
                      <img 
                        src={event.images[0]} 
                        alt={event.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {isStartingSoon && (
                        <Badge className="absolute top-2 left-2 bg-thrivvo-orange text-white border-0">
                          Soon!
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="w-2/3 p-3">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                            <Badge variant="outline" className="ml-1 text-xs">
                              {timeUntil}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center text-muted-foreground text-xs mt-1">
                            <MapPin size={12} className="mr-1" />
                            <span className="line-clamp-1">{event.location.name} • {event.location.distance}mi</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-xs">
                            <Calendar size={12} className="mr-1 text-muted-foreground" />
                            <span>
                              {new Date(event.time.start).toLocaleDateString(undefined, { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <Clock size={12} className="ml-2 mr-1 text-muted-foreground" />
                            <span>
                              {new Date(event.time.start).toLocaleTimeString(undefined, { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={event.host.avatar} />
                                <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{event.host.name}</span>
                            </div>
                            
                            <div className="flex items-center text-xs">
                              <Users size={12} className="mr-1 text-muted-foreground" />
                              <span>
                                {event.attendees.count}{event.attendees.max ? `/${event.attendees.max}` : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No house parties found</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => navigate('/create-event')}
              >
                Create one?
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default HouseParties;
