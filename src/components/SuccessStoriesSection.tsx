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
            <span className="text-black dark:text-white">Real Results from </span>
            <span className="text-purple-600 dark:text-purple-500">Real People</span>
          </h2>
          
          {/* Supporting Text with 95% Stat */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-2xl">
              Our students achieve remarkable success. Join thousands of entrepreneurs who've transformed their ideas into thriving businesses.
            </p>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-6 shadow-lg flex-shrink-0">
              <div className="text-white">
                <p className="text-5xl font-black mb-2">95%</p>
                <p className="text-lg font-bold">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Large Rounded Light Purple Panel */}
        <div className="bg-purple-100 dark:bg-purple-950/30 rounded-[3rem] p-8 lg:p-12">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Sarah M. Card */}
            <div 
              className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              data-testid="testimonial-sarah"
            >
              <div className="overflow-hidden">
                <img 
                  src={nonprofitImage} 
                  alt="Sarah M. nonprofit founder" 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xl lg:text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Sarah M.</p>
                <p className="text-base lg:text-lg text-neutral-600 dark:text-neutral-300">Raised $500K for nonprofit</p>
              </div>
            </div>
            
            {/* Tech Startup Card */}
            <div 
              className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              data-testid="testimonial-tech"
            >
              <div className="overflow-hidden">
                <img 
                  src={successImage} 
                  alt="Tech startup team success" 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xl lg:text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Tech Startup</p>
                <p className="text-base lg:text-lg text-neutral-600 dark:text-neutral-300">$2M Series A secured</p>
              </div>
            </div>
            
            {/* Maria L. Card */}
            <div 
              className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              data-testid="testimonial-maria"
            >
              <div className="overflow-hidden">
                <img 
                  src={educatorImage} 
                  alt="Maria L. social enterprise" 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xl lg:text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Maria L.</p>
                <p className="text-base lg:text-lg text-neutral-600 dark:text-neutral-300">Built $1M social enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;