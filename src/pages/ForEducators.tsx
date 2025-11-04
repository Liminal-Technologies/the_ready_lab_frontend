import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ForEducators = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-foreground">
            For Educators
          </h1>
          <p className="text-lg text-muted-foreground">
            Create, share, and monetize your courses with our platform.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForEducators;
