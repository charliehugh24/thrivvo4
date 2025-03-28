
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { mockEvents } from '@/data/mockData';
import { Event } from '@/types';
import { SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = mockEvents.filter(event => 
      event.title.toLowerCase().includes(value.toLowerCase()) ||
      event.description.toLowerCase().includes(value.toLowerCase()) ||
      event.category.toLowerCase().includes(value.toLowerCase())
    );
    
    setSearchResults(filtered);
  };

  const handleSelectEvent = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <AppLayout activeTab="search" onTabChange={(value) => value !== "search" && navigate("/")}>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Search Events</h1>
        
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search events..." 
              value={searchQuery}
              onValueChange={handleSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <CommandList>
            {searchResults.length === 0 && searchQuery !== '' && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            
            {searchResults.length > 0 && (
              <CommandGroup heading="Events">
                {searchResults.map((event) => (
                  <CommandItem 
                    key={event.id}
                    onSelect={() => handleSelectEvent(event.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-muted overflow-hidden mr-3">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.category}</p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {searchQuery === '' && (
              <div className="py-6 text-center">
                <SearchIcon className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Type to search for events
                </p>
              </div>
            )}
          </CommandList>
        </Command>
        
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </h2>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Search;
