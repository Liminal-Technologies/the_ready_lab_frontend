import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, ThumbsUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: string;
  user: string;
  avatar: string;
  question: string;
  upvotes: number;
  timestamp: string;
  answered: boolean;
}

interface QAPanelProps {
  eventId: string;
  isEducator: boolean;
}

export const QAPanel = ({ eventId, isEducator }: QAPanelProps) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      user: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      question:
        "Can you explain the difference between useMemo and useCallback?",
      upvotes: 12,
      timestamp: "5 min ago",
      answered: false,
    },
    {
      id: "2",
      user: "Maria Garcia",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      question:
        "What are the best practices for state management in large React apps?",
      upvotes: 8,
      timestamp: "8 min ago",
      answered: false,
    },
    {
      id: "3",
      user: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      question: "How do you handle error boundaries in production?",
      upvotes: 5,
      timestamp: "12 min ago",
      answered: true,
    },
  ]);
  const [upvotedQuestions, setUpvotedQuestions] = useState<string[]>([]);

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return;

    const question: Question = {
      id: Date.now().toString(),
      user: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      question: newQuestion,
      upvotes: 0,
      timestamp: "Just now",
      answered: false,
    };

    setQuestions([question, ...questions]);
    setNewQuestion("");

    toast({
      title: "Question submitted!",
      description: "The educator will answer questions during the event",
    });
  };

  const handleUpvote = (questionId: string) => {
    if (upvotedQuestions.includes(questionId)) {
      // Remove upvote
      setUpvotedQuestions(upvotedQuestions.filter((id) => id !== questionId));
      setQuestions(
        questions.map((q) =>
          q.id === questionId ? { ...q, upvotes: q.upvotes - 1 } : q,
        ),
      );
    } else {
      // Add upvote
      setUpvotedQuestions([...upvotedQuestions, questionId]);
      setQuestions(
        questions.map((q) =>
          q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q,
        ),
      );
    }
  };

  const handleMarkAsAnswered = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, answered: true } : q,
      ),
    );
    toast({
      title: "Marked as answered",
      description: "Question has been marked as answered",
    });
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Question Input */}
      <div className="p-4 border-b">
        <Textarea
          placeholder="Ask a question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="min-h-[80px] mb-2"
          maxLength={300}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {newQuestion.length}/300
          </span>
          <Button
            onClick={handleSubmitQuestion}
            disabled={!newQuestion.trim()}
            size="sm"
          >
            Ask Question
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No questions yet</p>
              <p className="text-sm mt-2">Be the first to ask a question!</p>
            </div>
          ) : (
            questions
              .sort((a, b) => b.upvotes - a.upvotes)
              .map((q) => (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg border ${
                    q.answered ? "bg-muted/50 border-muted" : "bg-card"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          upvotedQuestions.includes(q.id)
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => handleUpvote(q.id)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">{q.upvotes}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={q.avatar}
                          alt={q.user}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium">{q.user}</span>
                        <span className="text-xs text-muted-foreground">
                          {q.timestamp}
                        </span>
                        {q.answered && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Answered
                          </span>
                        )}
                      </div>

                      <p className="text-sm mb-2">{q.question}</p>

                      {isEducator && !q.answered && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsAnswered(q.id)}
                          className="mt-2"
                        >
                          Mark as Answered
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
