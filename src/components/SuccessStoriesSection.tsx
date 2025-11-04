import nonprofitImage from "@/assets/nonprofit-founder.jpg";
import successImage from "@/assets/success-group.jpg";
import educatorImage from "@/assets/educator-1.jpg";

// Ecudum-style Success Stories/Testimonials Section redesigned
const SuccessStoriesSection = () => {
  const testimonials = [
    {
      name: "Divan ninsia",
      date: "Feb 2024",
      quote: "I recently completed the AI Mastery course on your platform and I must say, it exceeded my expectations in many ways. The content was comprehensive, well-organized, and delivered in a clear manner.",
      image: nonprofitImage,
      role: "Nonprofit Founder"
    },
    {
      name: "Junstan gargein",
      date: "Jan 2024",
      quote: "I wanted to share my feedback on the experience. Overall, I found the platform to be incredibly beneficial for my learning journey. The instructors are knowledgeable and supportive.",
      image: successImage,
      role: "Tech Startup CEO"
    },
    {
      name: "Maria Rodriguez",
      date: "Mar 2024",
      quote: "The Ready Lab helped me build a fundable business from scratch. Within 6 months, I secured $1M in funding for my social enterprise. The practical tools and expert guidance were invaluable.",
      image: educatorImage,
      role: "Social Enterprise Founder"
    }
  ];

  return (
    // Testimonials section - Ecudum style with warm beige background
    <section 
      className="py-20 lg:py-32 dark:bg-orange-900/20 transition-colors duration-200"
      style={{ backgroundColor: 'hsl(36 44% 93%)' }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header with ghost text */}
        <div className="mb-16">
          <div className="relative">
            {/* Ghost text behind */}
            <h2 
              className="absolute -top-6 left-0 text-7xl md:text-8xl lg:text-9xl font-bold leading-none select-none pointer-events-none"
              style={{ color: 'hsl(36 20% 90%)', opacity: 0.5 }}
              aria-hidden="true"
            >
              Success
            </h2>
            
            {/* Small accent tag */}
            <div className="mb-4">
              <span 
                className="inline-block text-sm font-medium px-4 py-2 rounded-full"
                style={{ 
                  backgroundColor: 'hsl(30 30% 70%)',
                  color: 'hsl(30 30% 30%)'
                }}
              >
                Students satisfactions
              </span>
            </div>

            {/* Main headline */}
            <h2 
              className="relative text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl"
              style={{ color: 'hsl(30 30% 30%)' }}
            >
              Discover what our student{" "}
              <span className="block mt-2">feel of</span>
            </h2>
          </div>
        </div>

        {/* Testimonial cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              data-testid={`testimonial-card-${index}`}
            >
              {/* Profile header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-black dark:text-white text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {testimonial.date}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'hsl(30 30% 40%)' }}
              >
                " {testimonial.quote}
              </p>

              {/* Role badge */}
              <div className="mt-4">
                <span 
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: 'hsl(45 100% 51% / 0.15)',
                    color: 'hsl(30 30% 30%)'
                  }}
                >
                  {testimonial.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="text-center">
            <div 
              className="text-5xl md:text-6xl font-bold mb-2"
              style={{ color: 'hsl(30 30% 30%)' }}
              data-testid="stat-success-rate"
            >
              95%
            </div>
            <div className="text-base text-neutral-700 dark:text-neutral-300">
              Success Rate
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Graduates achieve goals within 12 months
            </div>
          </div>
          
          <div className="text-center">
            <div 
              className="text-5xl md:text-6xl font-bold mb-2"
              style={{ color: 'hsl(30 30% 30%)' }}
              data-testid="stat-capital-raised"
            >
              $2M+
            </div>
            <div className="text-base text-neutral-700 dark:text-neutral-300">
              Capital Raised
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              By our students collectively
            </div>
          </div>
          
          <div className="text-center">
            <div 
              className="text-5xl md:text-6xl font-bold mb-2"
              style={{ color: 'hsl(30 30% 30%)' }}
              data-testid="stat-active-learners"
            >
              3,200+
            </div>
            <div className="text-base text-neutral-700 dark:text-neutral-300">
              Active Learners
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Growing community of founders
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;