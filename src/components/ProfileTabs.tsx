
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import EventList from '@/components/EventList';
import { MessageSquare, CalendarDays, Image } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const hostedEvents = mockEvents.filter(event => event.host.name === userName);
  const attendingEvents = mockEvents.slice(0, 2);
  
  // Content for empty states
  const renderEmptyState = (icon: React.ReactNode, title: string, message: string) => (
    <div className="flex flex-col items-center justify-center text-center py-8 md:py-12 px-3 md:px-4">
      <div className="bg-muted rounded-full p-3 mb-3">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-medium mb-2">{title}</h3>
      <p className="text-xs md:text-sm text-muted-foreground max-w-md">{message}</p>
    </div>
  );

  return (
    <Tabs defaultValue="events" className="flex-1">
      <div className="px-1 md:px-4 border-b">
        <TabsList className="bg-transparent h-10 md:h-12 w-full">
          <TabsTrigger 
            value="events" 
            className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-thrivvo-teal rounded-none h-10 md:h-12 text-xs md:text-sm"
          >
            Events
          </TabsTrigger>
          <TabsTrigger 
            value="attending" 
            className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-thrivvo-teal rounded-none h-10 md:h-12 text-xs md:text-sm"
          >
            Attending
          </TabsTrigger>
          <TabsTrigger 
            value="photos" 
            className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-thrivvo-teal rounded-none h-10 md:h-12 text-xs md:text-sm"
          >
            Photos
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="events" className="p-3 md:p-4 pt-2">
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-base md:text-lg font-medium">Hosted Events</h3>
          
          {hostedEvents.length > 0 ? (
            <EventList events={hostedEvents} />
          ) : (
            renderEmptyState(
              <CalendarDays className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />,
              "No hosted events yet",
              isCurrentUser 
                ? "When you create events, they'll appear here. Start by creating your first event!" 
                : `${userName} hasn't hosted any events yet.`
            )
          )}
        </div>
      </TabsContent>

      <TabsContent value="attending" className="p-3 md:p-4 pt-2">
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-base md:text-lg font-medium">Events Attending</h3>
          
          {attendingEvents.length > 0 ? (
            <EventList events={attendingEvents} />
          ) : (
            renderEmptyState(
              <CalendarDays className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />,
              "No upcoming events",
              isCurrentUser 
                ? "When you RSVP to events, they'll appear here. Explore events to find something that interests you!" 
                : `${userName} is not attending any upcoming events.`
            )
          )}
        </div>
      </TabsContent>

      <TabsContent value="photos" className="p-3 md:p-4 pt-2">
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-base md:text-lg font-medium">Photos</h3>
          
          {isCurrentUser ? (
            <div className="grid grid-cols-3 gap-1 md:gap-2">
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
            renderEmptyState(
              <Image className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />,
              "No photos shared yet",
              `${userName} hasn't shared any photos from events yet.`
            )
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
