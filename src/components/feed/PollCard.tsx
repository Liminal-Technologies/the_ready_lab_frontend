import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BarChart3, CheckCircle } from 'lucide-react';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollCardProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted?: boolean;
}

export const PollCard = ({
  question,
  options,
  totalVotes,
  hasVoted: initialHasVoted = false,
}: PollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(initialHasVoted);

  const handleVote = () => {
    if (selectedOption) {
      setHasVoted(true);
      // TODO: Submit vote to backend
    }
  };

  return (
    <Card className="relative overflow-hidden p-6 bg-white">
      <div className="flex items-start gap-3 mb-4">
        <BarChart3 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-lg mb-1">Community Poll</h3>
          <p className="text-muted-foreground text-sm">{totalVotes} votes</p>
        </div>
      </div>

      <h4 className="font-semibold mb-4">{question}</h4>

      {!hasVoted ? (
        <>
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            <div className="space-y-3">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          <Button 
            className="w-full mt-4" 
            onClick={handleVote}
            disabled={!selectedOption}
          >
            Vote
          </Button>
        </>
      ) : (
        <div className="space-y-3">
          {options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isSelected = option.id === selectedOption;
            
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{option.text}</span>
                    {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                  </div>
                  <span className="font-semibold">{percentage.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
