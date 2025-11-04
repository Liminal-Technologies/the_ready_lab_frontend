import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CustomSaaS = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Custom Solutions</h1>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade learning management systems tailored to your
            organization.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomSaaS;
