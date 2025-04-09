
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import LocationSearch from './LocationSearch';
import { useToast } from '@/hooks/use-toast';

interface EventData {
  type: string;
  name: string;
  description: string;
  location: string;
  date: string;
  isPaid?: boolean;
  price?: string;
  ticketLimit?: string;
  salesDeadline?: string;
  ticketType?: 'digital' | 'external';
  paymentMethod?: string;
  refundPolicy?: string;
}

interface EventFormProps {
  eventData: EventData;
  onDataChange: (field: string, value: string | boolean | number) => void;
  onBack: () => void;
  onNext: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ eventData, onDataChange, onBack, onNext }) => {
  const { toast } = useToast();

  // Handle switch toggle for paid events
  const handleIsPaidChange = (checked: boolean) => {
    onDataChange('isPaid', checked);
  };

  // Make sure location changes are properly handled
  const handleLocationChange = (location: string) => {
    onDataChange('location', location);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Describe your event" 
          rows={4}
          value={eventData.description}
          onChange={(e) => onDataChange('description', e.target.value)}
        />
      </div>

      <LocationSearch 
        location={eventData.location}
        onLocationChange={handleLocationChange}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium">Date & Time</label>
        <Input 
          type="datetime-local" 
          value={eventData.date}
          onChange={(e) => onDataChange('date', e.target.value)}
        />
      </div>

      <div className="border-t my-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="isPaid" 
              checked={eventData.isPaid} 
              onCheckedChange={handleIsPaidChange}
            />
            <Label htmlFor="isPaid" className="font-medium">This is a paid event</Label>
          </div>
        </div>

        {eventData.isPaid && (
          <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium text-sm text-muted-foreground">Payment Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price Per Person</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                <Input 
                  id="price"
                  type="number"
                  min="0.00"
                  step="0.01"
                  className="pl-8"
                  placeholder="0.00"
                  value={eventData.price || ''}
                  onChange={(e) => onDataChange('price', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticketLimit">Ticket Limit (optional)</Label>
              <Input 
                id="ticketLimit"
                type="number"
                min="1"
                placeholder="e.g., 50"
                value={eventData.ticketLimit || ''}
                onChange={(e) => onDataChange('ticketLimit', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salesDeadline">Sales Deadline</Label>
              <Select 
                value={eventData.salesDeadline || ''}
                onValueChange={(value) => onDataChange('salesDeadline', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deadline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">1 hour before event</SelectItem>
                  <SelectItem value="2hours">2 hours before event</SelectItem>
                  <SelectItem value="1day">1 day before event</SelectItem>
                  <SelectItem value="untilStart">Until event starts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Ticket Type</Label>
              <RadioGroup 
                value={eventData.ticketType || 'digital'} 
                onValueChange={(value) => onDataChange('ticketType', value)}
              >
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital">Digital QR Pass (auto-generated)</Label>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external">External Link (e.g., Eventbrite)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="refundPolicy">Refund Policy (Optional)</Label>
              <Select 
                value={eventData.refundPolicy || ''}
                onValueChange={(value) => onDataChange('refundPolicy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select refund policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No refunds</SelectItem>
                  <SelectItem value="24hours">Up to 24 hours before event</SelectItem>
                  <SelectItem value="48hours">Up to 48 hours before event</SelectItem>
                  <SelectItem value="custom">Custom policy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button onClick={onNext} className="w-full">
          Continue to Photos
        </Button>
      </div>
    </div>
  );
};

export default EventForm;
