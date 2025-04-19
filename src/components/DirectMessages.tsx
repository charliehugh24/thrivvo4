import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/useToast';

interface Message {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
}

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message: string | null;
  unread: boolean;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

const DirectMessages: React.FC = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);
  
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation]);
  
  const fetchConversations = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Fetch profile information for each conversation
      const conversationsWithProfiles = await Promise.all(
        data.map(async (conv) => {
          const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', otherUserId)
            .single();

          return {
            ...conv,
            profiles: profile || { username: 'Unknown', avatar_url: null }
          };
        })
      );

      setConversations(conversationsWithProfiles);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChatHistory(prev => ({
        ...prev,
        [conversationId]: data,
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    setSending(true);
    try {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversation,
          sender_id: user.id,
          text: messageText,
        });

      if (messageError) throw messageError;

      // Update conversation's last message and timestamp
      const { error: conversationError } = await supabase
        .from('conversations')
        .update({
          last_message: messageText,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activeConversation);

      if (conversationError) throw conversationError;

      setMessageText('');
      fetchMessages(activeConversation);
      fetchConversations(); // Refresh conversation list to update last message
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare size={20} />
          {conversations.some(conv => conv.unread) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Messages</DialogTitle>
          <DialogDescription>
            Chat with your contacts and event attendees
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {loading ? (
            <div className="text-center p-4">
              <p>Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              {conversations.map(conversation => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <Avatar>
                    <AvatarImage src={conversation.profiles.avatar_url} />
                    <AvatarFallback>
                      {conversation.profiles.username?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {conversation.profiles.username || 'Unknown User'}
                    </p>
                    {conversation.last_message && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
        
        {activeConversation && (
          <div className="mt-4">
            <ScrollArea className="h-[200px] mb-4">
              {chatHistory[activeConversation]?.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  } mb-2`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-thrivvo-teal text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleSendMessage(e);
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={sending || !messageText.trim()}
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DirectMessages;
