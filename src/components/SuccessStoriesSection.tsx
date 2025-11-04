import nonprofitImage from "@/assets/nonprofit-founder.jpg";
import successImage from "@/assets/success-group.jpg";
import educatorImage from "@/assets/educator-1.jpg";

const SuccessStoriesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-neutral-900 transition-colors duration-200">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 lg:mb-16 relative overflow-hidden">
          {/* Ghost Text Background */}
          <div className="absolute left-0 top-0 opacity-[0.05] dark:opacity-[0.02] select-none pointer-events-none overflow-hidden">
            <h2 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black leading-none whitespace-nowrap text-neutral-900 dark:text-white">
              REAL RESULTS
            </h2>
          </div>
          
          {/* Small Purple Label */}
          <div className="mb-6 relative">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold">
              Success stories
            </span>
          </div>
          
          {/* Large Headline */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 relative">
            <span className="text-black dark:text-white">Real Results from Real People</span>
          </h2>
        </div>
        
        {/* Large Rounded Light Purple Panel */}
        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-[3rem] p-8 lg:p-12">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Sarah M. Card */}
            <div 
              className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              data-testid="testimonial-sarah"
            >
              <img 
                src={nonprofitImage} 
                alt="Sarah M. nonprofit founder" 
                className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xl lg:text-2xl font-bold mb-1">Sarah M.</p>
                <p className="text-base lg:text-lg">Raised $500K for nonprofit</p>
              </div>
            </div>
            
            {/* Tech Startup Card */}
            <div 
              className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              data-testid="testimonial-tech"
            >
              <img 
                src={successImage} 
                alt="Tech startup team success" 
                className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xl lg:text-2xl font-bold mb-1">Tech Startup</p>
                <p className="text-base lg:text-lg">$2M Series A secured</p>
              </div>
            </div>
            
            {/* Maria L. Card */}
            <div 
              className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              data-testid="testimonial-maria"
            >
              <img 
                src={educatorImage} 
                alt="Maria L. social enterprise" 
                className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xl lg:text-2xl font-bold mb-1">Maria L.</p>
                <p className="text-base lg:text-lg">Built $1M social enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;