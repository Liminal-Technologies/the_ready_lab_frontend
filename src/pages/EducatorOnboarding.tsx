import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Sparkles } from "lucide-react";

const EXPERTISE_OPTIONS = [
  "Funding & Grants",
  "Legal & Compliance",
  "Marketing & Branding",
  "Infrastructure",
  "Finance & Accounting",
  "AI & Technology",
  "Operations",
  "Sales",
  "Product Development",
  "HR & Talent",
];

const TEACHING_STYLES = [
  { id: "visual", label: "Visual", description: "Charts, diagrams, videos" },
  { id: "auditory", label: "Auditory", description: "Lectures, discussions" },
  { id: "kinesthetic", label: "Kinesthetic", description: "Hands-on, interactive" },
  { id: "reading", label: "Reading/Writing", description: "Articles, documents" },
];

const CONTENT_TYPES = [
  { id: "microlearning", label: "Microlearning", description: "5-15 min lessons" },
  { id: "deep", label: "Deep Learning", description: "45-60 min courses" },
  { id: "live", label: "Live Events", description: "Workshops, Q&A" },
  { id: "products", label: "Digital Products", description: "Templates, guides" },
];

export default function EducatorOnboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedTeachingStyles, setSelectedTeachingStyles] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload - just create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expertise)
        ? prev.filter((e) => e !== expertise)
        : [...prev, expertise]
    );
  };

  const toggleTeachingStyle = (style: string) => {
    setSelectedTeachingStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const toggleContentType = (type: string) => {
    setSelectedContentTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleSaveAndContinue = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue.",
        variant: "destructive",
      });
      return;
    }

    if (selectedExpertise.length === 0) {
      toast({
        title: "Select expertise",
        description: "Please select at least one area of expertise.",
        variant: "destructive",
      });
      return;
    }

    // Save educator profile to localStorage
    const educatorProfile = {
      name,
      bio,
      photoPreview,
      expertise: selectedExpertise,
      teachingStyles: selectedTeachingStyles,
      contentTypes: selectedContentTypes,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("educatorProfile", JSON.stringify(educatorProfile));

    toast({
      title: "Profile created! 🎉",
      description: "Welcome to The Ready Lab. Let's start building your courses!",
    });

    // Navigate to educator dashboard
    navigate("/educator/dashboard");
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Step 2 of 2</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Tell Us About Yourself</h1>
          <p className="text-lg text-muted-foreground">
            Help learners discover you by sharing your background and teaching style
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Educator Profile</CardTitle>
            <CardDescription>
              This information will appear on your educator profile and help students find you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-educator-name"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <button
                      onClick={() => setPhotoPreview(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      data-testid="button-remove-photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outline"
                      asChild
                      data-testid="button-upload-photo"
                    >
                      <span className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Photo
                      </span>
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell students about your background, experience, and what makes you passionate about teaching..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                data-testid="input-educator-bio"
              />
              <p className="text-sm text-muted-foreground">
                {bio.length}/500 characters
              </p>
            </div>

            {/* Expertise Tags */}
            <div className="space-y-3">
              <Label>Areas of Expertise *</Label>
              <p className="text-sm text-muted-foreground">
                Select all that apply
              </p>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_OPTIONS.map((expertise) => (
                  <Badge
                    key={expertise}
                    variant={selectedExpertise.includes(expertise) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm hover:opacity-80 transition-opacity"
                    onClick={() => toggleExpertise(expertise)}
                    data-testid={`badge-expertise-${expertise.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {expertise}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Teaching Styles */}
            <div className="space-y-3">
              <Label>Teaching Styles</Label>
              <p className="text-sm text-muted-foreground">
                How do you prefer to teach? Select all that apply
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {TEACHING_STYLES.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => toggleTeachingStyle(style.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTeachingStyles.includes(style.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    data-testid={`pill-teaching-${style.id}`}
                  >
                    <div className="font-medium mb-1">{style.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {style.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Types */}
            <div className="space-y-3">
              <Label>Preferred Content Types</Label>
              <p className="text-sm text-muted-foreground">
                What type of content do you want to create?
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {CONTENT_TYPES.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => toggleContentType(type.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedContentTypes.includes(type.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    data-testid={`pill-content-${type.id}`}
                  >
                    <div className="font-medium mb-1">{type.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {type.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                size="lg"
                onClick={handleSaveAndContinue}
                data-testid="button-save-continue"
              >
                Save & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
