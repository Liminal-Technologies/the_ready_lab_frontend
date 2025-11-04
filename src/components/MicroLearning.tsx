import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Award,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const microLessons = [
  {
    id: 1,
    title: "EIN Setup Essentials",
    content:
      "💼 Getting your EIN is step #1 to fundability!\n\n✅ Apply directly with the IRS (free!)\n✅ Takes 5-10 minutes online\n✅ Unlocks business banking & credibility\n\nSkip the paid services - do it yourself and save $200+",
    author: "Maria Rodriguez",
    avatar: "MR",
    time: "5m ago",
    likes: 156,
    comments: 23,
    category: "Business Infrastructure",
    duration: "3 min",
    track: "Infrastructure",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Grant vs. Investment: Know the Difference",
    content:
      "🎯 Grants = Free money (no equity lost)\nInvestments = Money for ownership\n\nGrant tip: Focus on impact, not profit in your pitch.\nInvestor tip: Show scalability and ROI potential.\n\nKnow which door you're knocking on!",
    author: "David Kim",
    avatar: "DK",
    time: "12m ago",
    likes: 203,
    comments: 41,
    category: "Funding Readiness",
    duration: "4 min",
    track: "Funding",
    level: "Beginner",
  },
  {
    id: 3,
    title: "Brand Message Formula",
    content:
      "🚀 The Ready Lab Brand Formula:\n\nWE HELP [target audience]\nTO [desired outcome]\nSO THEY CAN [bigger vision]\n\nExample: 'We help early-stage founders build fundable businesses so they can scale with confidence.'\n\nClear. Fundable. Memorable.",
    author: "Jessica Chen",
    avatar: "JC",
    time: "45m ago",
    likes: 178,
    comments: 32,
    category: "Branding for Growth",
    duration: "5 min",
    track: "Branding",
    level: "Intermediate",
  },
  {
    id: 4,
    title: "AI Prompt for Business Plans",
    content:
      "🤖 Transform ChatGPT into your business strategist:\n\n'Act as a business consultant. Help me create a [section] for my [industry] business that [goal]. Include specific metrics and actionable steps.'\n\nSpecific prompts = better outputs. Try it!",
    author: "Carlos Martinez",
    avatar: "CM",
    time: "2h ago",
    likes: 267,
    comments: 58,
    category: "AI for Entrepreneurs",
    duration: "6 min",
    track: "AI Tools",
    level: "Intermediate",
  },
];

const MicroLearning = () => {
  const { t } = useLanguage();
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<string>("all");

  const handleLike = (id: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const tracks = ["all", "Funding", "Infrastructure", "Branding", "AI Tools"];
  const filteredLessons =
    filter === "all"
      ? microLessons
      : microLessons.filter((lesson) => lesson.track === filter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success";
      case "Intermediate":
        return "bg-warning/10 text-warning";
      case "Advanced":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-accent/10 text-accent";
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white border-t border-neutral-100 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-600 px-4 py-2 rounded-lg text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4" />
            {t("micro.hotTopics")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            {t("micro.title")}
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
            {t("micro.subtitle")}
          </p>

          {/* Track Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tracks.map((track) => (
              <Button
                key={track}
                variant={filter === track ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(track)}
                className="capitalize"
              >
                {track === "all" ? t("micro.allTracks") : track}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="transition-all duration-200">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {lesson.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {lesson.author}
                      </p>
                      <p className="text-sm text-neutral-600">{lesson.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getLevelColor(lesson.level)}
                      variant="outline"
                    >
                      {lesson.level}
                    </Badge>
                    <div className="flex items-center gap-1 text-neutral-600 text-xs">
                      <Clock className="h-3 w-3" />
                      {lesson.duration}
                    </div>
                  </div>
                </div>

                {/* Track Badge */}
                <div className="mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {lesson.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {lesson.title}
                  </h3>
                  <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
                    {lesson.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(lesson.id)}
                      className="flex items-center gap-2 text-neutral-600 hover:text-yellow-500 transition-all duration-200"
                    >
                      <Heart
                        className={`h-5 w-5 ${likedPosts.has(lesson.id) ? "fill-current text-red-500" : ""}`}
                      />
                      <span className="text-sm">
                        {lesson.likes + (likedPosts.has(lesson.id) ? 1 : 0)}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 text-neutral-600 hover:text-yellow-500 transition-all duration-200">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{lesson.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-neutral-600 hover:text-yellow-500 transition-all duration-200">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                  <Button size="sm" variant="secondary">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {t("micro.startLesson")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg">
            <Award className="h-5 w-5 mr-2" />
            {t("micro.getCertified")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MicroLearning;
