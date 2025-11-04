import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LearningFeed } from "./LearningFeed";

const Explore = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LearningFeed />
      <Footer />
    </div>
  );
};

export default Explore;
