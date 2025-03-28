
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, XIcon } from 'lucide-react';
import { Event, EventCategory } from '@/types';
import { mockEvents, eventCategories } from '@/data/mockData';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const results = mockEvents.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const handleCategorySelect = (category: EventCategory) => {
    setQuery(category);
    const results = mockEvents.filter(event => 
      event.category === category
    );
    setSearchResults(results);
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
            <h2 className="text-lg font-semibold mb-3">
              {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
            </h2>
            <div className="space-y-4">
              {searchResults.length > 0 ? (
                searchResults.map((event) => (
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
                <p className="text-center text-muted-foreground py-6">No results found for "{query}"</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Search;
