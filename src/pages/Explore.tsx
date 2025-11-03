import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LearningFeed } from "./LearningFeed";

const Explore = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900">
      <Header />
      <LearningFeed />
      <Footer />
    </div>
  );
};

export default Explore;
