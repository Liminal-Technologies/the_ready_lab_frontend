import nonprofitImage from "@/assets/nonprofit-founder.jpg";
import successImage from "@/assets/success-group.jpg";
import educatorImage from "@/assets/educator-1.jpg";

const SuccessStoriesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            Real Results from Real People
          </h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          <div className="relative group overflow-hidden rounded-xl">
            <img 
              src={nonprofitImage} 
              alt="Sarah M. nonprofit founder" 
              className="w-full h-48 object-cover shadow-sm group-hover:shadow-md transition-all duration-200"
            />
            <div className="absolute inset-0 bg-black/60 rounded-xl"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-semibold">Sarah M.</p>
              <p className="text-xs">Raised $500K for nonprofit</p>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-xl">
            <img 
              src={successImage} 
              alt="Tech startup team success" 
              className="w-full h-48 object-cover shadow-sm group-hover:shadow-md transition-all duration-200"
            />
            <div className="absolute inset-0 bg-black/60 rounded-xl"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-semibold">Tech Startup</p>
              <p className="text-xs">$2M Series A secured</p>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-xl">
            <img 
              src={educatorImage} 
              alt="Maria L. social enterprise" 
              className="w-full h-48 object-cover shadow-sm group-hover:shadow-md transition-all duration-200"
            />
            <div className="absolute inset-0 bg-black/60 rounded-xl"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-semibold">Maria L.</p>
              <p className="text-xs">Built $1M social enterprise</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xl font-bold text-neutral-900 dark:text-white mb-2">95% Success Rate</p>
          <p className="text-base text-neutral-600 dark:text-neutral-400">Graduates achieve goals within 12 months</p>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;