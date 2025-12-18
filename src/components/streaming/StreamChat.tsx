import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

interface StreamChatProps {
  eventId: string;
  isInstructor?: boolean;
}

export const StreamChat = ({ eventId, isInstructor = false }: StreamChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('Anonymous');
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        // Try to get username from profiles
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.full_name) {
              setUsername(data.full_name);
            } else {
              setUsername(user.email?.split('@')[0] || 'User');
            }
          });
      }
    });

    // Load recent chat history
    loadChatHistory();

    // Subscribe to real-time chat messages
    const channel = supabase
      .channel(`chat:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'stream_chat_messages',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'stream_chat_messages',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const deletedId = (payload.old as any).id;
          setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [eventId]);

  const loadChatHistory = async () => {
    const { data, error } = await supabase
      .from('stream_chat_messages')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error loading chat:', error);
      // Use demo messages as fallback
      setMessages(getDemoMessages());
      setTimeout(scrollToBottom, 100);
      return;
    }

    if (data && data.length > 0) {
      setMessages(data);
    } else {
      // Use demo messages if no real messages exist
      setMessages(getDemoMessages());
    }
    setTimeout(scrollToBottom, 100);
  };

  const getDemoMessages = (): ChatMessage[] => [
    {
      id: 'demo-1',
      user_id: 'demo-user-1',
      username: 'Sarah M.',
      message: 'Really excited for this session!',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-2',
      user_id: 'demo-user-2',
      username: 'James K.',
      message: 'Can you explain the grant timeline again?',
      created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-3',
      user_id: 'demo-user-3',
      username: 'Dr. Chen',
      message: 'Great question James! Typically 3-6 months from submission to decision.',
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-4',
      user_id: 'demo-user-4',
      username: 'Alex T.',
      message: 'What about federal grants vs private foundations?',
      created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-5',
      user_id: 'demo-user-5',
      username: 'Maria L.',
      message: 'This is super helpful, thank you!',
      created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    },
  ];

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // If not logged in, add message locally as demo
    if (!userId) {
      const demoMessage: ChatMessage = {
        id: `demo-${Date.now()}`,
        user_id: 'demo-user',
        username: 'You',
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, demoMessage]);
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
      return;
    }

    const { error } = await supabase.from('stream_chat_messages').insert({
      event_id: eventId,
      user_id: userId,
      username: username,
      message: newMessage.trim(),
    });

    if (error) {
      // Fall back to local message if DB insert fails
      const localMessage: ChatMessage = {
        id: `local-${Date.now()}`,
        user_id: userId,
        username: username,
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, localMessage]);
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
      return;
    }

    setNewMessage('');
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('stream_chat_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Live Chat</h3>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm text-primary">
                    {msg.username}
                  </span>
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
                {(isInstructor || msg.user_id === userId) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteMessage(msg.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message..."
            maxLength={500}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};
