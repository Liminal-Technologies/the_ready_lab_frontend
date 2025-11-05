import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface MockQuizPlayerProps {
  lessonTitle: string;
  passThreshold?: number;
  onComplete?: (passed: boolean, score: number) => void;
}

const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question_text: "What is the first step in securing funding for your organization?",
    options: [
      "Immediately start writing grant proposals",
      "Research and identify potential funding sources aligned with your mission",
      "Create a budget without research",
      "Contact every funder you can find"
    ],
    correct_answer: 1,
    explanation: "Thorough research to identify funders whose priorities align with your organization's mission is crucial before approaching them or writing proposals."
  },
  {
    id: "q2",
    question_text: "What makes a grant proposal compelling to funders?",
    options: [
      "Length and complexity",
      "Clear demonstration of need, impact, and alignment with funder priorities",
      "Using technical jargon",
      "Requesting the maximum amount possible"
    ],
    correct_answer: 1,
    explanation: "Successful proposals clearly articulate the problem, your solution, expected impact, and how it aligns with the funder's mission and priorities."
  },
  {
    id: "q3",
    question_text: "What is a key element of an effective investor pitch?",
    options: [
      "Speaking as fast as possible to cover everything",
      "A clear problem statement, solution, market opportunity, and financial projections",
      "Avoiding questions from investors",
      "Focusing only on product features"
    ],
    correct_answer: 1,
    explanation: "Investors need to understand the problem you're solving, your solution, the market opportunity, and realistic financial projections to make informed decisions."
  },
  {
    id: "q4",
    question_text: "Why is building relationships with funders important?",
    options: [
      "It's not important; focus only on applications",
      "It increases chances of future funding and creates mutual understanding",
      "It's only useful for large organizations",
      "Relationships guarantee funding regardless of proposal quality"
    ],
    correct_answer: 1,
    explanation: "Strong relationships with funders lead to better understanding of their priorities, valuable feedback, and increased likelihood of sustained support over time."
  },
  {
    id: "q5",
    question_text: "What should a diversified funding strategy include?",
    options: [
      "Relying on a single major funder",
      "Multiple revenue streams including grants, donations, partnerships, and earned income",
      "Only pursuing the largest grants available",
      "Avoiding small donors to focus on major gifts"
    ],
    correct_answer: 1,
    explanation: "A diversified funding strategy reduces risk by combining various funding sources, ensuring stability even if one stream decreases."
  }
];

export function MockQuizPlayer({ lessonTitle, passThreshold = 70, onComplete }: MockQuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showFeedback) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = mockQuestions[currentQuestionIndex];
    setAnswers({
      ...answers,
      [currentQuestion.id]: selectedAnswer,
    });
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const correctAnswers = mockQuestions.filter(
      (q) => answers[q.id] === q.correct_answer
    ).length;
    const finalScore = Math.round((correctAnswers / mockQuestions.length) * 100);
    const passed = finalScore >= passThreshold;

    setScore(finalScore);
    setQuizCompleted(true);

    localStorage.setItem(`quiz_${lessonTitle}_score`, finalScore.toString());
    localStorage.setItem(`quiz_${lessonTitle}_passed`, passed.toString());

    if (passed) {
      toast.success(`Quiz passed with ${finalScore}%! 🎉`);
    } else {
      toast.error(`Quiz score: ${finalScore}%. You need ${passThreshold}% to pass.`);
    }

    if (onComplete) {
      onComplete(passed, finalScore);
    }
  };

  const handleReset = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
  };

  if (!quizStarted) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-[#E5A000]" />
            {lessonTitle}
          </CardTitle>
          <CardDescription>
            {mockQuestions.length} questions • Pass threshold: {passThreshold}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Test your knowledge of the concepts covered in this module. You need to score at least {passThreshold}% to pass and unlock the next module.
          </p>
          <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Answer all {mockQuestions.length} multiple-choice questions
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Get immediate feedback on each answer
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Retake the quiz as many times as needed
            </li>
          </ul>
          <Button 
            onClick={() => setQuizStarted(true)} 
            className="w-full bg-[#E5A000] hover:bg-[#E5A000]/90 text-white"
            data-testid="button-start-quiz"
          >
            <Award className="h-4 w-4 mr-2" />
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    const passed = score >= passThreshold;
    return (
      <Card className="max-w-3xl mx-auto">
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
          <p className="text-muted-foreground mb-6">
            {passed 
              ? "Congratulations! You've mastered this module's concepts and can proceed to the next lesson."
              : "Don't worry! Review the lesson material and try again. You can retake this quiz as many times as needed."
            }
          </p>
          <Button
            onClick={handleReset}
            variant={passed ? 'outline' : 'default'}
            className={passed ? 'w-full' : 'w-full bg-[#E5A000] hover:bg-[#E5A000]/90 text-white'}
            data-testid="button-retake-quiz"
          >
            {passed ? 'Retake Quiz' : 'Try Again'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct_answer;
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardDescription>
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
          </CardDescription>
          <Progress value={progress} className="w-32 h-2" />
        </div>
        <CardTitle className="text-lg">{currentQuestion.question_text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer?.toString()} onValueChange={(v) => handleAnswerSelect(parseInt(v))}>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-4 rounded-lg border transition-colors ${
                  showFeedback
                    ? index === currentQuestion.correct_answer
                      ? 'bg-green-50 dark:bg-green-950 border-green-500'
                      : index === selectedAnswer && !isCorrect
                      ? 'bg-red-50 dark:bg-red-950 border-red-500'
                      : 'border-muted'
                    : selectedAnswer === index
                    ? 'border-[#E5A000] bg-[#E5A000]/5'
                    : 'border-muted hover:border-[#E5A000]/50'
                }`}
                data-testid={`quiz-option-${index}`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showFeedback} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
                {showFeedback && index === currentQuestion.correct_answer && (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
                {showFeedback && index === selectedAnswer && !isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </RadioGroup>

        {showFeedback && (
          <Alert className={`mt-4 ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}`}>
            <AlertDescription>
              <strong className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                {isCorrect ? 'Correct!' : 'Incorrect.'}
              </strong>
              <p className="mt-1 text-sm text-muted-foreground">{currentQuestion.explanation}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex gap-2">
          {!showFeedback ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 bg-[#E5A000] hover:bg-[#E5A000]/90 text-white"
              data-testid="button-submit-answer"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion} 
              className="flex-1 bg-[#E5A000] hover:bg-[#E5A000]/90 text-white"
              data-testid="button-next-question"
            >
              {currentQuestionIndex < mockQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
