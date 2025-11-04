import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface QuizPlayerProps {
  quizId: string;
  quizTitle: string;
  passThreshold: number;
  onComplete: (passed: boolean, score: number) => void;
}

export const QuizPlayer = ({ quizId, quizTitle, passThreshold, onComplete }: QuizPlayerProps) => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (error) throw error;

      const formattedQuestions: QuizQuestion[] = data.map(q => {
        // Parse options from JSON
        const options = Array.isArray(q.options) 
          ? q.options as string[]
          : typeof q.options === 'object' && q.options !== null
          ? Object.values(q.options as Record<string, unknown>).filter((v): v is string => typeof v === 'string')
          : [];

        // Parse correct answer
        let correctAnswer = 0;
        if (typeof q.correct_answer === 'number') {
          correctAnswer = q.correct_answer;
        } else if (typeof q.correct_answer === 'object' && q.correct_answer !== null) {
          const answerObj = q.correct_answer as Record<string, unknown>;
          correctAnswer = typeof answerObj.answer === 'number' ? answerObj.answer : 0;
        }

        return {
          id: q.id,
          question_text: q.question_text,
          options,
          correct_answer: correctAnswer,
          explanation: q.explanation || '',
        };
      });

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quiz questions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showFeedback) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    setAnswers({
      ...answers,
      [currentQuestion.id]: selectedAnswer,
    });
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.correct_answer
    ).length;
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    const passed = finalScore >= passThreshold;

    setScore(finalScore);
    setQuizCompleted(true);

    // Save attempt to database
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        await supabase.from('quiz_attempts').insert({
          user_id: user.user.id,
          quiz_id: quizId,
          lesson_id: null as any, // Required by schema but we have quiz_id
          score: finalScore,
          passed,
          answers: answers as any,
          completed_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }

    onComplete(passed, finalScore);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-muted-foreground">Loading quiz...</p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-muted-foreground">No questions available for this quiz.</p>
        </CardContent>
      </Card>
    );
  }

  if (!quizStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{quizTitle}</CardTitle>
          <CardDescription>
            {questions.length} questions • Pass threshold: {passThreshold}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Answer all questions to complete this quiz. You need {passThreshold}% to pass.
          </p>
          <Button onClick={() => setQuizStarted(true)} className="w-full">
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    const passed = score >= passThreshold;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {passed ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                Quiz Passed!
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                Quiz Not Passed
              </>
            )}
          </CardTitle>
          <CardDescription>
            Your score: {score}% (Required: {passThreshold}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={score} className="mb-4" />
          {!passed && (
            <p className="text-muted-foreground mb-4">
              You can retake this quiz to improve your score.
            </p>
          )}
          <Button
            onClick={() => {
              setQuizStarted(false);
              setQuizCompleted(false);
              setCurrentQuestionIndex(0);
              setAnswers({});
              setSelectedAnswer(null);
              setShowFeedback(false);
            }}
            variant={passed ? 'outline' : 'default'}
            className="w-full"
          >
            {passed ? 'Retake Quiz' : 'Try Again'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct_answer;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardDescription>
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardDescription>
          <Progress value={progress} className="w-32" />
        </div>
        <CardTitle className="text-lg">{currentQuestion.question_text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer?.toString()} onValueChange={(v) => handleAnswerSelect(parseInt(v))}>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  showFeedback
                    ? index === currentQuestion.correct_answer
                      ? 'bg-green-50 border-green-500'
                      : index === selectedAnswer && !isCorrect
                      ? 'bg-red-50 border-red-500'
                      : 'border-muted'
                    : selectedAnswer === index
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showFeedback} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
                {showFeedback && index === currentQuestion.correct_answer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {showFeedback && index === selectedAnswer && !isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </RadioGroup>

        {showFeedback && (
          <Alert className={`mt-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
            <AlertDescription>
              <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong>
              <p className="mt-1 text-sm">{currentQuestion.explanation}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex gap-2">
          {!showFeedback ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="flex-1"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="flex-1">
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
