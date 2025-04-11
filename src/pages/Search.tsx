
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, XIcon, Calendar, User } from 'lucide-react';
import { Event, EventCategory } from '@/types';
import { mockEvents, eventCategories, mockUsers } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Search = () => {
  const [query, setQuery] = useState('');
  const [eventResults, setEventResults] = useState<Event[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'users'>('events');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) {
      setEventResults([]);
      setUserResults([]);
      setHasSearched(false);
      return;
    }

    // Search for events
    const filteredEvents = mockEvents.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.category.toLowerCase().includes(query.toLowerCase())
    );
    
    // Search for users
    const filteredUsers = Object.values(mockUsers).filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      (user.interests && user.interests.some(interest => 
        interest.toLowerCase().includes(query.toLowerCase())
      ))
    );
    
    setEventResults(filteredEvents);
    setUserResults(filteredUsers);
    setHasSearched(true);
  };

  const handleClear = () => {
    setQuery('');
    setEventResults([]);
    setUserResults([]);
    setHasSearched(false);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const handleUserClick = (userId: string) => {
    // Ensure consistent ID format
    const formattedId = userId.startsWith('user') && !userId.includes('-') 
      ? `user-${userId.slice(4)}` 
      : userId;
    
    navigate(`/profile/${formattedId}`);
  };

  const handleCategorySelect = (category: EventCategory) => {
    setQuery(category);
    const results = mockEvents.filter(event => 
      event.category === category
    );
    setEventResults(results);
    setUserResults([]);
    setActiveTab('events');
    setHasSearched(true);
  };

  return (
    <AppLayout activeTab="search">
      <div className="p-4">
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, people, places..."
              className="pr-8"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {query && (
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                <XIcon size={16} />
              </button>
            )}
          </div>
          <Button onClick={handleSearch}>
            <SearchIcon size={18} />
          </Button>
        </div>

        {!hasSearched && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Popular Categories</h2>
            <div className="flex flex-wrap gap-2">
              {eventCategories.map((category) => (
                <Button 
                  key={category.id}
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCategorySelect(category.id)}
                  className="flex items-center gap-1"
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {hasSearched && (
          <div>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'events' | 'users')}>
              <TabsList className="mb-4">
                <TabsTrigger value="events" className="flex items-center gap-1">
                  <Calendar size={16} />
                  Events ({eventResults.length})
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1">
                  <User size={16} />
                  People ({userResults.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="events">
                <div className="space-y-4">
                  {eventResults.length > 0 ? (
                    eventResults.map((event) => (
                      <div 
                        key={event.id} 
                        className="flex gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleEventClick(event.id)}
                      >
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={event.images[0]} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                              {event.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {event.location.distance} mi away
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No events found</h3>
                      <p className="text-muted-foreground">No events match your search for "{query}"</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="users">
                <div className="space-y-4">
                  {userResults.length > 0 ? (
                    userResults.map((user) => (
                      <div 
                        key={user.id} 
                        className="flex gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleUserClick(user.id)}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{user.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.interests && user.interests.slice(0, 3).map((interest: string, index: number) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs font-normal"
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <User className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No people found</h3>
                      <p className="text-muted-foreground">No people match your search for "{query}"</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Search;
