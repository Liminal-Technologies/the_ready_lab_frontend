import educatorImage from "@/assets/educator-1.jpg";

const IndustryExpertsSection = () => {
  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <img 
              src={educatorImage} 
              alt="Professional educator teaching workshop" 
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Learn from Industry Experts
            </h3>
            <p className="text-muted-foreground mb-4">
              Our instructors are successful entrepreneurs and business experts who've been where you want to go.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                500+ Expert Instructors
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                $2B+ Raised by Alumni
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryExpertsSection;