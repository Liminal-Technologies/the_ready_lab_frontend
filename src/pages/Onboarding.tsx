import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Check, Target, Globe, User, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const interests = [
    'Funding & Grants',
    'Business Operations',
    'Branding & Marketing',
    'Financial Planning',
    'Legal & Compliance',
    'Technology & AI',
    'Partnership Strategy',
    'Social Impact'
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        // TODO: backend: upload to S3
        // For now, save to localStorage
        setProfilePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedInterests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }
    if (currentStep === 2 && !selectedLanguage) {
      toast.error('Please select your preferred language');
      return;
    }
    // Step 3 is optional, no validation needed

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkipProfile = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save to localStorage for demo
      const onboardingData = {
        interests: selectedInterests,
        language: selectedLanguage,
        name: profileName,
        bio: profileBio,
        photo: profilePhoto,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      
      if (user) {
        // TODO: backend: Save user interests and language preference
        // await supabase.from('user_interests').insert(...)
        // await supabase.from('profiles').update({ preferred_language: selectedLanguage })
      }

      toast.success('Welcome to The Ready Lab! 🎉', {
        description: 'Your profile is all set up'
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error('Failed to save preferences', {
        description: 'But you can still proceed to your dashboard'
      });
      navigate('/dashboard');
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to The Ready Lab!</h1>
          <p className="text-muted-foreground">Let's personalize your experience</p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of 3</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            {currentStep === 1 && (
              <>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>What are you interested in?</CardTitle>
                <CardDescription>
                  Select topics you'd like to learn about (choose at least one)
                </CardDescription>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Choose your language</CardTitle>
                <CardDescription>
                  Select your preferred language for courses and content
                </CardDescription>
              </>
            )}
            {currentStep === 3 && (
              <>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Complete your profile (Optional)</CardTitle>
                <CardDescription>
                  Add a photo and bio to personalize your experience - you can skip this step
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Step 1: Interests */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <div
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedInterests.includes(interest)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    data-testid={`interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedInterests.includes(interest)}
                        onCheckedChange={() => toggleInterest(interest)}
                      />
                      <Label className="cursor-pointer">{interest}</Label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Language Selection */}
            {currentStep === 2 && (
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-6 border rounded-lg cursor-pointer transition-all ${
                      selectedLanguage === lang.code
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    data-testid={`language-${lang.code}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedLanguage === lang.code
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {selectedLanguage === lang.code && (
                          <Check className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                      <div className="text-3xl">{lang.flag}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-foreground">{lang.label}</p>
                        <p className="text-sm text-muted-foreground">
                          All courses and content will be shown in {lang.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Optional Profile */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                        <User className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <label 
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        data-testid="input-photo-upload"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">Click to upload a profile photo</p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Your Name</Label>
                  <Input
                    id="profile-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    data-testid="input-profile-name"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="profile-bio">Bio (Optional)</Label>
                  <Textarea
                    id="profile-bio"
                    placeholder="Tell us a bit about yourself and your goals..."
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    rows={4}
                    data-testid="textarea-profile-bio"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be visible to educators and community members
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-2">
                {currentStep === 3 && (
                  <Button 
                    variant="ghost" 
                    onClick={handleSkipProfile}
                    data-testid="button-skip-profile"
                  >
                    Skip
                  </Button>
                )}
                <Button onClick={handleNext} data-testid="button-next">
                  {currentStep === 3 ? 'Complete' : 'Next'}
                  {currentStep < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-muted-foreground hover:text-foreground underline"
            data-testid="button-skip-onboarding"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
