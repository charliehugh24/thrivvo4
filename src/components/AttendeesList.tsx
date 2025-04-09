
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield } from 'lucide-react';

type Attendee = {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  interests?: string[];
};

// Mock data for attendees - in a real app, this would come from an API
const mockAttendees: Attendee[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    avatar: '/lovable-uploads/d7368d4b-69d9-45f2-af66-f97850473f89.png',
    verified: true,
    bio: 'Adventure seeker and music lover',
    interests: ['music', 'hiking', 'photography']
  },
  {
    id: 'user-2',
    name: 'Sam Rivera',
    bio: 'Food enthusiast and traveler',
    interests: ['food', 'travel', 'cooking']
  },
  {
    id: 'user-3',
    name: 'Taylor Morgan',
    avatar: '/lovable-uploads/de943395-a2a4-4ee9-bed4-16cc40cfdc47.png',
    verified: true,
    bio: 'Tech geek and coffee addict',
    interests: ['technology', 'coffee', 'gaming']
  },
  {
    id: 'user-4',
    name: 'Jordan Kim',
    bio: 'Fitness instructor and wellness coach',
    interests: ['fitness', 'nutrition', 'meditation']
  },
  {
    id: 'user-5',
    name: 'Casey Lopez',
    avatar: '/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png',
    bio: 'Artist and creative mind',
    interests: ['art', 'design', 'music']
  }
];

interface AttendeesListProps {
  eventId: string;
}

const AttendeesList: React.FC<AttendeesListProps> = ({ eventId }) => {
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get attendees for a specific event
    const fetchAttendees = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For now, use mock data - in a real app, filter by event ID
      setAttendees(mockAttendees);
      setLoading(false);
    };

    fetchAttendees();
  }, [eventId]);

  const handleViewProfile = (userId: string) => {
    // Navigate to specific user profile page using the userId
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-md">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (attendees.length === 0) {
    return <p className="text-center text-muted-foreground py-2">No attendees yet. Be the first to join!</p>;
  }

  return (
    <div className="space-y-2">
      {attendees.map(attendee => (
        <div 
          key={attendee.id}
          className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={attendee.avatar} />
              <AvatarFallback>{attendee.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{attendee.name}</span>
                {attendee.verified && (
                  <Shield size={14} className="text-thrivvo-teal" />
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {attendee.interests && attendee.interests.slice(0, 2).map((interest, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="text-xs font-normal h-5 px-1.5"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleViewProfile(attendee.id)}
            aria-label={`View ${attendee.name}'s profile`}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AttendeesList;
