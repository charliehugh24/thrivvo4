
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { useNavigate, useLocation } from 'react-router-dom';

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

// Map for mock profile IDs to conversation IDs
const mockUserIdToConvId: Record<string, string> = {
  'user-1': '2', // Alex Johnson
  'user-2': '4', // Sam Rivera - will create dynamically
  'user-3': '5', // Taylor Morgan - will create dynamically
  'user-4': '6', // Jordan Kim - will create dynamically
  'user-5': '7', // Casey Lopez - will create dynamically
};

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

// Mock user data for additional conversations
const mockUserProfiles = {
  'user-1': {
    name: 'Alex Johnson',
    avatar: '/lovable-uploads/d7368d4b-69d9-45f2-af66-f97850473f89.png',
  },
  'user-2': {
    name: 'Sam Rivera',
    avatar: null,
  },
  'user-3': {
    name: 'Taylor Morgan',
    avatar: '/lovable-uploads/de943395-a2a4-4ee9-bed4-16cc40cfdc47.png',
  },
  'user-4': {
    name: 'Jordan Kim',
    avatar: null,
  },
  'user-5': {
    name: 'Casey Lopez',
    avatar: '/lovable-uploads/d6f2d298-cff6-47aa-9362-b19aae49b23e.png',
  },
};

interface DirectMessagesProps {
  initialConversationId?: string;
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const DirectMessages: React.FC<DirectMessagesProps> = ({ initialConversationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  
  // Load initial state from localStorage or use mock data
  const savedData = loadMessagesFromLocalStorage();
  const [conversations, setConversations] = useState(savedData?.conversations || mockConversations);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(
    savedData?.chatHistory || mockChatHistory
  );
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveMessagesToLocalStorage(conversations, chatHistory);
  }, [conversations, chatHistory]);
  
  // Check URL for message query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const messageUserId = params.get('message');
    
    if (messageUserId) {
      // Open the messages dialog
      setIsOpen(true);
      
      // Find or create conversation for this user
      const convId = findOrCreateConversation(messageUserId);
      if (convId) {
        handleOpenConversation(convId);
        
        // Check if there's a message text in the URL
        const messageText = params.get('text');
        if (messageText && convId) {
          // Send the message automatically
          sendMessage(convId, messageText);
        }
      }
      
      // Remove the query param
      navigate(location.pathname, { replace: true });
    }
  }, [location]);
  
  // Handle initial conversation if passed as prop
  useEffect(() => {
    if (initialConversationId) {
      setIsOpen(true);
      handleOpenConversation(initialConversationId);
    }
  }, [initialConversationId]);
  
  const findOrCreateConversation = (userId: string): string | null => {
    // Check if we already have a conversation mapped for this user
    if (mockUserIdToConvId[userId]) {
      return mockUserIdToConvId[userId];
    }
    
    // If not, check if user profile exists
    const userProfile = mockUserProfiles[userId as keyof typeof mockUserProfiles];
    if (!userProfile) return null;
    
    // Create a new conversation
    const newConvId = `conv-${Date.now()}`;
    
    // Create new conversation entry
    const newConversation = {
      id: newConvId,
      user: {
        id: userId,
        name: userProfile.name,
        avatar: userProfile.avatar || '',
      },
      lastMessage: "Start a conversation...",
      timestamp: new Date(),
      unread: false,
    };
    
    // Add to conversations list
    setConversations(prev => [newConversation, ...prev]);
    
    // Add empty chat history
    setChatHistory(prev => ({
      ...prev,
      [newConvId]: []
    }));
    
    // Map user ID to conversation ID
    mockUserIdToConvId[userId] = newConvId;
    
    return newConvId;
  };

  // New separate function to send a message that can be called from outside the component
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      sender: 'me',
      text: text,
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
          lastMessage: text,
          timestamp: new Date(),
          unread: false,
        };
      }
      return conv;
    }));

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

  const handleSendMessage = (conversationId: string) => {
    if (messageText.trim()) {
      sendMessage(conversationId, messageText);
      setMessageText('');
    }
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
          size="icon" 
          className="h-8 w-8 bg-muted/50"
        >
          <MessageSquare size={16} />
          {conversations.some(c => c.unread) && (
            <span className="absolute -top-1 -right-1 bg-thrivvo-orange text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
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

// Persistent storage for DM state
const STORAGE_KEY = 'thrivvo-direct-messages';

// Function to save state to localStorage
const saveMessagesToLocalStorage = (conversations: any[], chatHistory: Record<string, ChatMessage[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      conversations,
      chatHistory
    }));
  } catch (error) {
    console.error('Error saving messages to localStorage:', error);
  }
};

// Function to load state from localStorage
const loadMessagesFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading messages from localStorage:', error);
  }
  return null;
};

export default DirectMessages;
