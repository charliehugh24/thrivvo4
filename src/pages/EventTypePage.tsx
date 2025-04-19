import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import EventList from '@/components/EventList';
import { useAuth } from '@/contexts/AuthContext';
import { EventCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { eventCategories } from '@/data/eventCategories';

const EventTypePage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category') as EventCategory;
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the category name and icon
  const category = eventCategories.find(cat => cat.id === categoryId);
  const categoryName = category?.name || 'Events';
  const categoryIcon = category?.icon || '✨';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (categoryId) {
          query = query.eq('category', categoryId);
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
  }, [categoryId]);

  return (
    <AppLayout activeTab="discover">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{categoryIcon}</span>
          <h1 className="text-2xl font-bold">{categoryName}</h1>
        </div>

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
            <EventList 
              events={events} 
              emptyMessage={`No ${categoryName.toLowerCase()} found. Be the first to create one!`}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default EventTypePage; 