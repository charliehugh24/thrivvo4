
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Send, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types';

// Mock messages data
const mockConversations = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'Sarah Kim',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    lastMessage: 'Hey, are you going to the party tonight?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: true,
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    lastMessage: 'I just joined the app, what events do you recommend?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    unread: false,
  },
  {
    id: '3',
    user: {
      id: 'u3',
      name: 'Jamie Lee',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    lastMessage: 'Thanks for the invite!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    unread: false,
  },
];

interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: Date;
}

// Mock chat history for a conversation
const mockChatHistory: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'm1',
      sender: 'other',
      text: 'Hey! Are you free tonight?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'Maybe, what\'s going on?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
    },
    {
      id: 'm3',
      sender: 'other',
      text: 'There\'s a house party near campus!',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
    {
      id: 'm4',
      sender: 'other',
      text: 'A bunch of people from our community are going',
      timestamp: new Date(Date.now() - 1000 * 60 * 19),
    },
    {
      id: 'm5',
      sender: 'me',
      text: 'Sounds fun! What time?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: 'm6',
      sender: 'other',
      text: 'Starts at 9pm. I can send you the address.',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
    },
    {
      id: 'm7',
      sender: 'other',
      text: 'Hey, are you going to the party tonight?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  '2': [
    {
      id: 'm1',
      sender: 'other',
      text: 'Hi there! I just joined Thrivvo!',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'Welcome! How are you liking it so far?',
      timestamp: new Date(Date.now() - 1000 * 60 * 85),
    },
    {
      id: 'm3',
      sender: 'other',
      text: 'It\'s great! I\'m looking for events to attend this weekend',
      timestamp: new Date(Date.now() - 1000 * 60 * 80),
    },
    {
      id: 'm4',
      sender: 'me',
      text: 'There are some great house parties and a concert happening',
      timestamp: new Date(Date.now() - 1000 * 60 * 75),
    },
    {
      id: 'm5',
      sender: 'other',
      text: 'I just joined the app, what events do you recommend?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
  ],
  '3': [
    {
      id: 'm1',
      sender: 'me',
      text: 'Hi Jamie! I\'m hosting a small gathering next Friday, would you like to join?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 'm2',
      sender: 'other',
      text: 'Hey! That sounds fun! What time?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
    },
    {
      id: 'm3',
      sender: 'me',
      text: 'Around 7pm. I\'ll send you the details closer to the date.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
    },
    {
      id: 'm4',
      sender: 'other',
      text: 'Thanks for the invite!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
  ],
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const DirectMessages = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState(mockConversations);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(mockChatHistory);

  const handleSendMessage = (conversationId: string) => {
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      sender: 'me',
      text: messageText,
      timestamp: new Date(),
    };

    // Update chat history
    setChatHistory(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    // Update conversation preview
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: messageText,
          timestamp: new Date(),
          unread: false,
        };
      }
      return conv;
    }));

    setMessageText('');

    // Simulate receiving a reply after a short delay
    setTimeout(() => {
      const replyMessages = [
        "Cool! I'll see you there!",
        "That sounds great!",
        "Thanks for letting me know!",
        "Perfect! Looking forward to it.",
        "Awesome! I'll be there.",
      ];
      
      const randomReply = replyMessages[Math.floor(Math.random() * replyMessages.length)];
      
      const replyMessage: ChatMessage = {
        id: `m${Date.now()}`,
        sender: 'other',
        text: randomReply,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), replyMessage]
      }));
      
      // Update conversation preview with reply
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: randomReply,
            timestamp: new Date(),
            unread: activeConversation !== conversationId, // Mark as unread if not currently viewing
          };
        }
        return conv;
      }));
    }, 2000);
  };

  const handleOpenConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    
    // Mark conversation as read
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unread: false };
      }
      return conv;
    }));
  };

  const handleNewMessage = (user: User) => {
    toast({
      title: "Message sent!",
      description: `Your message to ${user.name} has been sent.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 h-8 ml-2 bg-muted/50"
        >
          <MessageSquare size={14} />
          <span className="font-normal">Messages</span>
          {conversations.some(c => c.unread) && (
            <span className="bg-thrivvo-orange text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {conversations.filter(c => c.unread).length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 h-[500px] flex flex-col">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle>
            {activeConversation ? (
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setActiveConversation(null)}
                  className="mr-2 h-8 w-8"
                >
                  <X size={16} />
                </Button>
                {conversations.find(c => c.id === activeConversation)?.user.name || 'Messages'}
              </div>
            ) : (
              'Messages'
            )}
          </DialogTitle>
        </DialogHeader>
        
        {!activeConversation ? (
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  onClick={() => handleOpenConversation(conversation.id)}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 ${conversation.unread ? 'bg-muted/30' : ''}`}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={conversation.user.avatar} />
                    <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className={`font-medium truncate ${conversation.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {conversation.user.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${conversation.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-thrivvo-orange rounded-full flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatHistory[activeConversation]?.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'me' 
                          ? 'bg-thrivvo-teal text-white rounded-br-none' 
                          : 'bg-muted rounded-bl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-3 border-t">
              <form 
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (activeConversation) {
                    handleSendMessage(activeConversation);
                  }
                }}
              >
                <Input 
                  placeholder="Type a message..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!messageText.trim()}
                  className="bg-thrivvo-teal text-white hover:bg-thrivvo-teal/90"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DirectMessages;
