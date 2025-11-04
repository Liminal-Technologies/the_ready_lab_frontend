import studentsImage from "@/assets/students-collaboration.jpg";

const CommunitySection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Join a Community
            </h3>
            <p className="text-muted-foreground mb-4">
              Connect with fellow entrepreneurs and changemakers. Share
              challenges, celebrate wins, and grow together.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                  <span className="text-success text-xs">✓</span>
                </div>
                <span className="text-sm text-foreground">
                  Weekly peer collaboration
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                  <span className="text-success text-xs">✓</span>
                </div>
                <span className="text-sm text-foreground">
                  Direct mentor access
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                  <span className="text-success text-xs">✓</span>
                </div>
                <span className="text-sm text-foreground">
                  Exclusive networking events
                </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src={studentsImage}
              alt="Entrepreneurs collaborating"
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
