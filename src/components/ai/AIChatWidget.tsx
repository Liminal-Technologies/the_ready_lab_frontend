import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, Minimize2, Send, Loader2, Lightbulb } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CONTEXTUAL_QUESTIONS = {
  dashboard: [
    "What should I learn next?",
    "How's my progress?",
    "Show me my completed courses",
    "What are my learning goals?"
  ],
  course: [
    "Tell me about this course",
    "Is this right for me?",
    "What will I learn?",
    "How long will this take?"
  ],
  lesson: [
    "Explain this concept",
    "Give me an example",
    "What are the key takeaways?",
    "How does this apply in practice?"
  ],
  certificates: [
    "How do I earn certificates?",
    "What certifications are available?",
    "Can I share my certificates?",
    "What's required for certification?"
  ],
  default: [
    "What course should I take next?",
    "How do I get certified?",
    "Explain a learning concept",
    "How can I track my progress?"
  ]
};

const MOCK_RESPONSES: Record<string, string> = {
  dashboard: "Based on your learning history, I recommend continuing with Advanced React Development. You're 65% through it and doing great! After that, consider exploring TypeScript Mastery to strengthen your skills.",
  course: "This course is perfect for intermediate learners who want to level up their skills. It covers practical, real-world applications with hands-on projects. You'll gain valuable skills that are in high demand.",
  lesson: "Let me break that down for you! This concept is fundamental because it helps you understand how components communicate and share data. Think of it like a conversation between different parts of your application.",
  certificates: "Great question! You earn certificates by completing all course modules and passing the final assessment with 70% or higher. Your certificates are automatically generated and can be downloaded or shared on LinkedIn.",
  default: "That's a great question! I'm here to help you with anything related to your learning journey. Feel free to ask about courses, lessons, certifications, or your progress."
};

export const AIChatWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI Learning Assistant. I'm here to help you with course recommendations, learning tips, and answering questions about your courses. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [visibleSuggestions, setVisibleSuggestions] = useState(3);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect current page context
  const getPageContext = () => {
    const path = location.pathname;
    
    if (path.includes('/dashboard')) {
      return { type: 'dashboard', label: 'Your Dashboard' };
    }
    if (path.includes('/courses/') && path.includes('/lessons/')) {
      return { type: 'lesson', label: 'Current Lesson' };
    }
    if (path.includes('/courses')) {
      return { type: 'course', label: 'Course Page' };
    }
    if (path.includes('/certificates')) {
      return { type: 'certificates', label: 'Certificates' };
    }
    if (path.includes('/lesson')) {
      return { type: 'lesson', label: 'Lesson Page' };
    }
    return { type: 'default', label: 'The Ready Lab' };
  };

  const pageContext = getPageContext();
  const contextualQuestions = CONTEXTUAL_QUESTIONS[pageContext.type as keyof typeof CONTEXTUAL_QUESTIONS] || CONTEXTUAL_QUESTIONS.default;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay with contextual response
    setTimeout(() => {
      const contextResponse = MOCK_RESPONSES[pageContext.type] || MOCK_RESPONSES.default;
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: contextResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleExampleClick = (question: string) => {
    handleSendMessage(question);
  };

  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 h-[60px] w-[60px] rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-[1000]"
              size="icon"
            >
              <Sparkles className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Ask AI</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card 
      className={`fixed right-6 shadow-2xl z-[1000] overflow-hidden transition-all duration-300 ${
        isMinimized 
          ? 'bottom-6 w-[300px] h-[60px]' 
          : 'bottom-6 w-[400px] h-[600px] animate-slide-in-right'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Learning Assistant</h3>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 h-[calc(600px-240px)]">
            <div className="space-y-4">

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-muted text-foreground'
                        : 'bg-primary/10 text-foreground border border-primary/20'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">AI is typing...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Contextual Suggestions */}
          <div className="px-4 py-3 border-t border-b bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">
                💡 Asking about: <span className="font-medium text-foreground">{pageContext.label}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {contextualQuestions.slice(0, visibleSuggestions).map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 transition-colors text-xs py-1"
                  onClick={() => handleExampleClick(question)}
                >
                  {question}
                </Badge>
              ))}
              {contextualQuestions.length > visibleSuggestions && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 transition-colors text-xs py-1"
                  onClick={() => setVisibleSuggestions(prev => 
                    prev === 3 ? contextualQuestions.length : 3
                  )}
                >
                  {visibleSuggestions === 3 ? `+${contextualQuestions.length - 3} more` : 'Show less'}
                </Badge>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                  disabled={isTyping}
                  maxLength={500}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {inputValue.length > 0 && (
                <p className="text-xs text-muted-foreground text-right">
                  {inputValue.length}/500
                </p>
              )}
            </form>
          </div>
        </>
      )}
    </Card>
  );
};
