import Header from "@/components/Header";
import Footer from "@/components/Footer";

const EducatorAgreement = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">Educator Agreement</h1>
          <div className="prose prose-lg">
            <p className="text-muted-foreground">
              Educator Agreement content will be added here.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EducatorAgreement;
