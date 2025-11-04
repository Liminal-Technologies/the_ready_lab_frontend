import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ForStudents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-foreground">
            For Students
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover courses and learning opportunities tailored for you.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForStudents;
