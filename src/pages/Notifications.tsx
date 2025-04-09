
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { mockEvents } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { BellIcon, UserPlus, Calendar, Check, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Notifications = () => {
  const navigate = useNavigate();
  
  // Mock data - in a real app this would come from user's data in a database
  const signedUpEvents = mockEvents.slice(0, 3); // First 3 events as example
  const followedUsers = [
    { id: 'user-2', name: 'Sam Rivera', avatar: 'https://randomuser.me/api/portraits/women/79.jpg' },
    { id: 'user-4', name: 'Jordan Kim', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  ];
  
  const pendingNotifications = [
    { 
      id: 'notif1', 
      type: 'event_invite', 
      event: mockEvents[4],
      from: { id: 'user-3', name: 'Taylor Morgan', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
      time: '2 hours ago'
    },
    { 
      id: 'notif2', 
      type: 'follow_request', 
      from: { id: 'user-5', name: 'Casey Lopez', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
      time: '5 hours ago'
    },
  ];
  
  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };
  
  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  
  const handleFollowUser = (userId: string) => {
    toast({
      title: "User followed!",
      description: "You'll receive notifications when they post new events.",
    });
  };
  
  const handleAcceptInvite = (notificationId: string) => {
    toast({
      title: "Invite accepted!",
      description: "You've been added to the event.",
    });
  };
  
  const handleMessageUser = (userId: string) => {
    // Added specific default message for Sam Rivera
    const messageText = userId === 'user-2' 
      ? 'Hello, I wanted to connect with you!' 
      : '';
    
    navigate(`?message=${userId}${messageText ? `&text=${encodeURIComponent(messageText)}` : ''}`);
  };
  
  return (
    <AppLayout activeTab="notifications">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        {pendingNotifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BellIcon className="text-thrivvo-teal" size={20} />
              Pending Notifications
            </h2>
            <div className="space-y-4">
              {pendingNotifications.map((notification) => (
                <div key={notification.id} className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
                  <div 
                    className="flex items-center gap-3 cursor-pointer" 
                    onClick={() => handleUserClick(notification.from.id)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={notification.from.avatar} 
                        alt={notification.from.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{notification.from.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.type === 'event_invite' 
                          ? `invited you to ${notification.event.title}` 
                          : 'wants to follow you'}
                      </p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMessageUser(notification.from.id)}
                    >
                      <MessageCircle size={16} className="mr-1" />
                      Message
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAcceptInvite(notification.id)}
                    >
                      <Check size={16} className="mr-1" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="text-thrivvo-teal" size={20} />
            Your Events
          </h2>
          {signedUpEvents.length > 0 ? (
            <div className="space-y-4">
              {signedUpEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-muted/50 rounded-lg p-4 cursor-pointer"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden">
                      <img 
                        src={event.images[0]} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.time.start).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">You haven't signed up for any events yet.</p>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <UserPlus className="text-thrivvo-teal" size={20} />
            People You Might Know
          </h2>
          <div className="space-y-4">
            {followedUsers.map((user) => (
              <div key={user.id} className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer" 
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">Shares your interests</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessageUser(user.id);
                    }}
                  >
                    <MessageCircle size={16} className="mr-1" />
                    Message
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowUser(user.id);
                    }}
                  >
                    <UserPlus size={16} className="mr-1" />
                    Follow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Notifications;
