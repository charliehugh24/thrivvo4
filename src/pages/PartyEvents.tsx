import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import EventList from '@/components/EventList';
import { useAuth } from '@/contexts/AuthContext';
import CategoryFilter from '@/components/CategoryFilter';
import { EventCategory } from '@/types';
import { eventCategories } from '@/data/eventCategories';
import { supabase } from '@/integrations/supabase/client';

const PartyEvents = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>('house-party');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [selectedCategory]);
  
  const handleCategorySelect = (category: EventCategory | null) => {
    setSelectedCategory(category);
  };
  
  return (
    <AppLayout activeTab="discover">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Events</h1>
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />
        <div className="mt-4">
          {loading ? (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium">Loading events...</h3>
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium text-red-500">{error}</h3>
            </div>
          ) : (
            <EventList events={events} emptyMessage="No events found" />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default PartyEvents;
