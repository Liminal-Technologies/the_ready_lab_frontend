import { EducatorProfile } from '@/components/EducatorProfile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EducatorProfileDemo = () => {
  // Demo educator data with sample video and subtitles
  const demoEducator = {
    id: '1',
    name: 'Dr. Sarah Martinez',
    title: 'Senior Business Strategy Consultant & Entrepreneur',
    bio: 'Dr. Sarah Martinez is a seasoned business strategist with over 15 years of experience helping startups and established companies secure funding. She has personally raised over $50M in venture capital and has guided hundreds of entrepreneurs through successful funding rounds. Her expertise spans across business model validation, financial projections, and investor relations.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&h=200&fit=crop&crop=face',
    rating: 4.9,
    studentsCount: 12500,
    coursesCount: 8,
    specialties: ['Business Strategy', 'Venture Capital', 'Financial Modeling', 'Pitch Development', 'Market Analysis'],
    featuredVideo: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', // Sample video URL
      title: 'Building Your Fundable Business Model',
      subtitles: [
        {
          start: 0,
          end: 4,
          text: "Welcome to this comprehensive course on building fundable businesses."
        },
        {
          start: 4,
          end: 8,
          text: "In today's competitive market, having a great idea isn't enough."
        },
        {
          start: 8,
          end: 12,
          text: "You need to demonstrate clear market validation and scalability."
        },
        {
          start: 12,
          end: 16,
          text: "Throughout this course, we'll explore proven frameworks and strategies."
        },
        {
          start: 16,
          end: 20,
          text: "We'll cover financial modeling, pitch development, and investor relations."
        },
        {
          start: 20,
          end: 24,
          text: "By the end, you'll have the tools to present a compelling investment case."
        },
        {
          start: 24,
          end: 28,
          text: "Let's start by understanding what investors really look for."
        },
        {
          start: 28,
          end: 32,
          text: "The key is building a business model that demonstrates clear ROI potential."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Educator Profile with AI Translation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience our AI-powered subtitle translation feature. Switch to Spanish using the language selector to see real-time translated subtitles.
            </p>
          </div>
          <EducatorProfile educator={demoEducator} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EducatorProfileDemo;