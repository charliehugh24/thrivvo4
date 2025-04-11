
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { mockEvents } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { BellIcon, UserPlus, Calendar, Check, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const Notifications = () => {
  const navigate = useNavigate();
  const [acceptedNotifications, setAcceptedNotifications] = useState<string[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  
  // Mock data - in a real app this would come from user's data in a database
  const signedUpEvents = mockEvents.slice(0, 3); // First 3 events as example
  const suggestedUsers = [
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
    // Toggle follow status
    if (followedUsers.includes(userId)) {
      setFollowedUsers(prev => prev.filter(id => id !== userId));
      toast({
        title: "Unfollowed",
        description: "You're no longer following this user.",
      });
    } else {
      setFollowedUsers(prev => [...prev, userId]);
      toast({
        title: "Following!",
        description: "You'll receive notifications when they post new events.",
      });
    }
  };
  
  const handleAcceptInvite = (notificationId: string) => {
    setAcceptedNotifications(prev => [...prev, notificationId]);
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
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-3">
          <h1 className="text-xl font-bold mb-4">Notifications</h1>
          
          {pendingNotifications.length > 0 && (
            <div className="mb-4">
              <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                <BellIcon className="text-thrivvo-teal" size={18} />
                Pending Notifications
              </h2>
              <div className="space-y-2">
                {pendingNotifications.map((notification) => (
                  <div key={notification.id} className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                    <div 
                      className="flex items-center gap-2 cursor-pointer" 
                      onClick={() => handleUserClick(notification.from.id)}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={notification.from.avatar} 
                          alt={notification.from.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{notification.from.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {notification.type === 'event_invite' 
                            ? `invited you to ${notification.event.title}` 
                            : 'wants to follow you'}
                        </p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessageUser(notification.from.id);
                        }}
                      >
                        <MessageCircle size={14} className="mr-1" />
                        Message
                      </Button>
                      {acceptedNotifications.includes(notification.id) ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 text-xs px-2 bg-green-50 text-green-600 border-green-200"
                          disabled
                        >
                          <Check size={14} className="mr-1" />
                          Accepted
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptInvite(notification.id);
                          }}
                        >
                          <Check size={14} className="mr-1" />
                          Accept
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <Calendar className="text-thrivvo-teal" size={18} />
              Your Events
            </h2>
            {signedUpEvents.length > 0 ? (
              <div className="space-y-2">
                {signedUpEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="bg-muted/50 rounded-lg p-3 cursor-pointer"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <div className="flex gap-2">
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img 
                          src={event.images[0]} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{event.description}</p>
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
              <p className="text-center text-muted-foreground py-3 text-sm">You haven't signed up for any events yet.</p>
            )}
          </div>
          
          <div>
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <UserPlus className="text-thrivvo-teal" size={18} />
              People You Might Know
            </h2>
            <div className="space-y-2">
              {suggestedUsers.map((user) => (
                <div key={user.id} className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                  <div 
                    className="flex items-center gap-2 cursor-pointer" 
                    onClick={() => handleUserClick(user.id)}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mr-2">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Shares your interests</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessageUser(user.id);
                      }}
                    >
                      <MessageCircle size={14} className="mr-1" />
                      Message
                    </Button>
                    {followedUsers.includes(user.id) ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 text-xs px-2 bg-green-50 text-green-600 border-green-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowUser(user.id);
                        }}
                      >
                        <Check size={14} className="mr-1" />
                        Following
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowUser(user.id);
                        }}
                      >
                        <UserPlus size={14} className="mr-1" />
                        Follow
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </AppLayout>
  );
};

export default Notifications;
