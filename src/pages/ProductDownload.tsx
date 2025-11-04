import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CheckCircle,
  Download,
  Copy,
  Clock,
  FileText,
  FileSpreadsheet,
  FileCode,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data - in production this would come from the database
const mockProducts = {
  "1": {
    id: "1",
    title: "Pitch Deck Template",
    description:
      "Professional investor-ready pitch deck with 15 proven slides. Used by 500+ funded startups.",
    price: 49,
    thumbnail:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    fileType: "PDF",
    fileSize: "2.4 MB",
    educator: "Sarah Johnson",
    downloadUrl: "https://example.com/download/pitch-deck-template.pdf",
    whatsIncluded: [
      "15 professionally designed slides",
      "Editable in PowerPoint, Keynote, or Google Slides",
      "Color scheme customization guide",
      "Real-world examples from funded startups",
      "Pitch presentation best practices guide",
    ],
    howToUse:
      "Open the file in your preferred presentation software. Customize the content, colors, and images to match your brand. Follow the included guide for best practices on pitching to investors.",
    supportEmail: "support@example.com",
  },
  "2": {
    id: "2",
    title: "Grant Writing Playbook",
    description:
      "Complete guide to winning nonprofit grants with templates and real examples.",
    price: 79,
    thumbnail:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    fileType: "PDF",
    fileSize: "5.8 MB",
    educator: "Michael Chen",
    downloadUrl: "https://example.com/download/grant-writing-playbook.pdf",
    whatsIncluded: [
      "200-page comprehensive guide",
      "10+ grant proposal templates",
      "Real winning grant examples",
      "Budget template spreadsheet",
      "Grant research checklist",
    ],
    howToUse:
      "Read through the guide to understand the grant writing process. Use the templates to structure your proposals. Study the real examples to see what works.",
    supportEmail: "support@example.com",
  },
};

const relatedProducts = [
  {
    id: "3",
    title: "Financial Model Spreadsheet",
    price: 99,
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    fileType: "Excel",
  },
  {
    id: "4",
    title: "Brand Strategy Worksheet",
    price: 29,
    thumbnail:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    fileType: "PDF",
  },
  {
    id: "5",
    title: "Social Impact Measurement Kit",
    price: 65,
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    fileType: "Excel",
  },
  {
    id: "6",
    title: "Nonprofit Budget Template",
    price: 39,
    thumbnail:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80",
    fileType: "Excel",
  },
];

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "excel":
    case "xlsx":
      return FileSpreadsheet;
    case "zip":
      return FileCode;
    default:
      return FileText;
  }
};

export default function ProductDownload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);

  const product = mockProducts[id as keyof typeof mockProducts];

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Product not found</h2>
            <Button onClick={() => navigate("/products")}>
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const FileIcon = getFileIcon(product.fileType);

  const handleDownload = () => {
    toast.success("Download started! 📥", {
      description: "Your file is being downloaded",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(product.downloadUrl);
    setCopySuccess(true);
    toast.success("Link copied! 📋", {
      description: "Download link copied to clipboard",
    });
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleRelatedProductClick = (productId: string) => {
    navigate(`/products`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">
              Thank you for your purchase! 🎉
            </h1>
            <h2 className="text-2xl text-muted-foreground mb-4">
              {product.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              Your download is ready
            </p>
          </div>

          {/* Download Section */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-12 py-6 text-lg bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </Button>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <FileIcon className="h-4 w-4" />
                  <span>
                    {product.fileType} • {product.fileSize}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Note */}
          <Card className="mb-8 border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm font-medium">
                  You can re-download this anytime from your Library
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-background rounded-md border text-sm font-mono truncate">
                    {product.downloadUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                  >
                    <Copy
                      className={`h-4 w-4 ${copySuccess ? "text-green-500" : ""}`}
                    />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Link expires in 24 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle>What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.whatsIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* How to Use */}
            <Card>
              <CardHeader>
                <CardTitle>How to Use It</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.howToUse}
                </p>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Need help?</p>
                  <p className="text-sm text-muted-foreground">
                    Contact support at{" "}
                    <a
                      href={`mailto:${product.supportEmail}`}
                      className="text-primary hover:underline"
                    >
                      {product.supportEmail}
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Products */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">You might also like...</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((relatedProduct) => {
                const RelatedFileIcon = getFileIcon(relatedProduct.fileType);
                return (
                  <Card
                    key={relatedProduct.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleRelatedProductClick(relatedProduct.id)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      <img
                        src={relatedProduct.thumbnail}
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant="secondary"
                      >
                        <RelatedFileIcon className="h-3 w-3 mr-1" />
                        {relatedProduct.fileType}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-2">
                        {relatedProduct.title}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between pt-0">
                      <span className="text-lg font-bold text-primary">
                        ${relatedProduct.price}
                      </span>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Back to Library */}
          <div className="text-center">
            <Button variant="outline" onClick={() => navigate("/my-purchases")}>
              Go to My Library
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
