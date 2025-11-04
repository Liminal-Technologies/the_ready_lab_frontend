import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingHero from "@/components/pricing/PricingHero";
import StudentPlansRevised from "@/components/pricing/StudentPlansRevised";
import EducatorPlansRevised from "@/components/pricing/EducatorPlansRevised";
import InstitutionPlans from "@/components/pricing/InstitutionPlans";
import PaymentOptions from "@/components/pricing/PaymentOptions";
import PricingFAQ from "@/components/pricing/PricingFAQ";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <PricingHero />
        <StudentPlansRevised />
        <EducatorPlansRevised />
        <InstitutionPlans />
        <PaymentOptions />
        <PricingFAQ />
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
