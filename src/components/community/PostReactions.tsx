import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EMOJIS = ["👍", "❤️", "🔥", "😂", "😮", "😢"];

interface PostReactionsProps {
  postId: string;
  currentUserId: string | null;
  initialCount: number;
}

export const PostReactions = ({
  postId,
  currentUserId,
  initialCount,
}: PostReactionsProps) => {
  const [hasReacted, setHasReacted] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [userEmoji, setUserEmoji] = useState<string | null>(null);

  useEffect(() => {
    checkUserReaction();
  }, [postId, currentUserId]);

  const checkUserReaction = async () => {
    if (!currentUserId) return;

    const { data } = await supabase
      .from("post_reactions")
      .select("emoji")
      .eq("post_id", postId)
      .eq("user_id", currentUserId)
      .single();

    if (data) {
      setHasReacted(true);
      setUserEmoji(data.emoji);
    }
  };

  const handleReaction = async (emoji: string) => {
    if (!currentUserId) return;

    try {
      if (hasReacted) {
        // Update existing reaction
        await supabase
          .from("post_reactions")
          .update({ emoji })
          .eq("post_id", postId)
          .eq("user_id", currentUserId);

        setUserEmoji(emoji);
      } else {
        // Add new reaction
        await supabase.from("post_reactions").insert({
          post_id: postId,
          user_id: currentUserId,
          emoji,
          reaction_type: "emoji",
        });

        setHasReacted(true);
        setUserEmoji(emoji);
        setCount(count + 1);
      }
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
  };

  const handleRemoveReaction = async () => {
    if (!currentUserId || !hasReacted) return;

    try {
      await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId);

      setHasReacted(false);
      setUserEmoji(null);
      setCount(Math.max(0, count - 1));
    } catch (error) {
      console.error("Error removing reaction:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={hasReacted ? "text-primary" : ""}
          onClick={hasReacted ? handleRemoveReaction : undefined}
        >
          {userEmoji || (
            <Heart
              className={`h-4 w-4 mr-2 ${hasReacted ? "fill-current" : ""}`}
            />
          )}
          {count}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex gap-2">
          {EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="text-2xl p-2 h-auto"
              onClick={() => handleReaction(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
