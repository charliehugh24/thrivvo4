
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import EventList from '@/components/EventList';

interface ProfileTabsProps {
  userName: string;
  isCurrentUser: boolean;
  mockEvents: any[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  userName, 
  isCurrentUser,
  mockEvents
}) => {
  return (
    <Tabs defaultValue="events" className="flex-1">
      <div className="px-4 border-b">
        <TabsList className="bg-transparent h-12">
          <TabsTrigger value="events" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-thrivvo-teal rounded-none h-12">
            Events
          </TabsTrigger>
          <TabsTrigger value="attending" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-thrivvo-teal rounded-none h-12">
            Attending
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-thrivvo-teal rounded-none h-12">
            Photos
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="events" className="p-4 pt-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hosted Events</h3>
          
          <EventList 
            events={mockEvents.filter(event => event.host.name === userName)}
            emptyMessage={
              isCurrentUser 
                ? "You haven't hosted any events yet. Create your first event!" 
                : `${userName} hasn't hosted any events yet.`
            }
          />
        </div>
      </TabsContent>

      <TabsContent value="attending" className="p-4 pt-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Events Attending</h3>
          
          <EventList 
            events={mockEvents.slice(0, 2)} 
            emptyMessage={
              isCurrentUser 
                ? "You're not attending any upcoming events." 
                : `${userName} is not attending any upcoming events.`
            }
          />
        </div>
      </TabsContent>

      <TabsContent value="photos" className="p-4 pt-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Photos</h3>
          
          {isCurrentUser ? (
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="aspect-square overflow-hidden">
                  <CardContent className="p-0">
                    <img 
                      src={`/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png`} 
                      alt={`Gallery image ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {userName} hasn't shared any photos yet.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
