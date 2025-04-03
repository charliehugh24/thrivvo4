
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventCategories } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';

const AddEvent = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Event creation not yet implemented",
      description: "This feature will be available soon!",
    });
  };

  return (
    <AppLayout activeTab="add">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">Add New Event</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Event Title
            </label>
            <Input id="title" placeholder="Enter event title" />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea id="description" placeholder="Describe your event" rows={4} />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <Input id="location" placeholder="Event location" />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date & Time
            </label>
            <Input id="date" type="datetime-local" />
          </div>
          
          <Button type="submit" className="w-full">Create Event</Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default AddEvent;
