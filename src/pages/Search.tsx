import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { eventCategories } from '@/data/eventCategories';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<Tables<'profiles'>[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const search = async () => {
      if (!searchQuery.trim()) {
        setEvents([]);
        setUsers([]);
        return;
      }
      
      setLoading(true);
      try {
        // Search events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .order('created_at', { ascending: false });
          
        if (eventsError) throw eventsError;
        
        // Search users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
          .order('created_at', { ascending: false });
          
        if (usersError) throw usersError;
        
        setEvents(eventsData?.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          category: event.category as Event['category'],
          location: event.location as Event['location'],
          time: event.time as Event['time'],
          host: event.host as Event['host'],
          attendees: event.attendees as Event['attendees'],
          price: event.price as Event['price'],
          images: event.images,
          vibe: event.vibe,
          isPrivate: event.isPrivate,
          isVerified: event.isVerified || false,
          monetized: event.monetized || false
        })) || []);
        
        setUsers(usersData || []);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search error",
          description: "Failed to perform search. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, toast]);
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/event-type?category=${categoryId}`);
  };
  
  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };
  
  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  
  return (
    <AppLayout activeTab="search">
      <div className="p-4">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search events, people, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Categories</h2>
            <div className="grid grid-cols-2 gap-2">
              {eventCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-3 bg-muted/40 rounded-lg cursor-pointer hover:bg-muted/60"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {loading && (
            <div className="text-center p-4">
              <p>Searching...</p>
            </div>
          )}
          
          {!loading && events.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Events</h2>
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-muted/40 rounded-lg cursor-pointer hover:bg-muted/60"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!loading && users.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">People</h2>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 bg-muted/40 rounded-lg cursor-pointer hover:bg-muted/60"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.username || 'User'}</h3>
                        {user.bio && (
                          <p className="text-sm text-muted-foreground">{user.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!loading && searchQuery && events.length === 0 && users.length === 0 && (
            <div className="text-center p-4">
              <p>No results found</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Search;
