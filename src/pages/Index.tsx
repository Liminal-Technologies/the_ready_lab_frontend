import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SuccessStoriesSection from "@/components/SuccessStoriesSection";
import Courses from "@/components/Courses";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-200">
      <Header />
      <Hero />
      <Features />
      <SuccessStoriesSection />
      <Courses />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;