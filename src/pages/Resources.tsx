import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Resources = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Resources</h1>
          <p className="text-lg text-muted-foreground">
            Guides, tutorials, and documentation to help you succeed.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
