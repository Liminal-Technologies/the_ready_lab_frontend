import nonprofitImage from "@/assets/nonprofit-founder.jpg";
import successImage from "@/assets/success-group.jpg";
import educatorImage from "@/assets/educator-1.jpg";

const SuccessStoriesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-purple-100 via-purple-50 to-white dark:from-purple-950/30 dark:via-purple-950/10 dark:to-neutral-900 transition-colors duration-200 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Hero Row */}
        <div className="relative mb-16 lg:mb-20 overflow-hidden">
          {/* Ghost Text Background */}
          <div className="absolute left-0 top-0 opacity-[0.05] dark:opacity-[0.02] select-none pointer-events-none">
            <h2 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black leading-none whitespace-nowrap text-neutral-900 dark:text-white">
              REAL RESULTS
            </h2>
          </div>
          
          {/* Main Content Row */}
          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-8 lg:pt-12">
            {/* Left: Headline */}
            <div>
              {/* Small Label */}
              <div className="mb-6">
                <span className="inline-block px-5 py-2.5 bg-purple-600 dark:bg-purple-900/30 text-white dark:text-purple-400 rounded-full text-sm font-bold shadow-sm">
                  Success stories
                </span>
              </div>
              
              {/* Large Headline */}
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-neutral-900 dark:text-white leading-tight">
                Real Results from Real People
              </h2>
            </div>
            
            {/* Right: Stat Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-white">
                <p className="text-6xl md:text-7xl font-black mb-4 text-white">95%</p>
                <p className="text-2xl md:text-3xl font-bold mb-2 text-white">Success Rate</p>
                <p className="text-lg text-white">
                  Graduates achieve goals within 12 months
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rounded Panel with Testimonial Cards */}
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-[3rem] p-8 lg:p-12">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Sarah M. Card */}
            <div 
              className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              data-testid="testimonial-sarah"
            >
              <img 
                src={nonprofitImage} 
                alt="Sarah M. nonprofit founder" 
                className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-2xl font-bold mb-2">Sarah M.</p>
                <p className="text-lg">Raised $500K for nonprofit</p>
              </div>
            </div>
            
            {/* Tech Startup Card */}
            <div 
              className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              data-testid="testimonial-tech"
            >
              <img 
                src={successImage} 
                alt="Tech startup team success" 
                className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-2xl font-bold mb-2">Tech Startup</p>
                <p className="text-lg">$2M Series A secured</p>
              </div>
            </div>
            
            {/* Maria L. Card */}
            <div 
              className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              data-testid="testimonial-maria"
            >
              <img 
                src={educatorImage} 
                alt="Maria L. social enterprise" 
                className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-2xl font-bold mb-2">Maria L.</p>
                <p className="text-lg">Built $1M social enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;