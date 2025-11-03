import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyProducts } from "@/components/empty-states/EmptyProducts";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, FileSpreadsheet, FileCode, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const mockProducts = [
  {
    id: "1",
    title: "Pitch Deck Template",
    description: "Professional investor-ready pitch deck with 15 proven slides. Used by 500+ funded startups.",
    price: 49,
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    fileType: "PDF",
    educator: "Sarah Johnson",
    downloads: 524,
    category: "Templates",
  },
  {
    id: "2",
    title: "Grant Writing Playbook",
    description: "Complete guide to winning nonprofit grants with templates and real examples.",
    price: 79,
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    fileType: "PDF",
    educator: "Michael Chen",
    downloads: 312,
    category: "Guides & Playbooks",
  },
  {
    id: "3",
    title: "Financial Model Spreadsheet",
    description: "3-year financial projection model with automated calculations and charts.",
    price: 99,
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    fileType: "Excel",
    educator: "David Martinez",
    downloads: 428,
    category: "Tools & Software",
  },
  {
    id: "4",
    title: "Brand Strategy Worksheet",
    description: "Step-by-step framework to define your brand positioning and messaging.",
    price: 29,
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    fileType: "PDF",
    educator: "Emma Wilson",
    downloads: 892,
    category: "Templates",
  },
  {
    id: "5",
    title: "Social Impact Measurement Kit",
    description: "Comprehensive toolkit for tracking and reporting social impact metrics.",
    price: 65,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    fileType: "Excel",
    educator: "James Anderson",
    downloads: 267,
    category: "Resources",
  },
  {
    id: "6",
    title: "Nonprofit Budget Template",
    description: "Complete budget planning template with cash flow projections.",
    price: 39,
    thumbnail: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80",
    fileType: "Excel",
    educator: "Lisa Thompson",
    downloads: 615,
    category: "Templates",
  },
  {
    id: "7",
    title: "Business Plan Master Guide",
    description: "200-page comprehensive business plan guide with examples from 50+ industries.",
    price: 89,
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80",
    fileType: "PDF",
    educator: "Robert Lee",
    downloads: 445,
    category: "Guides & Playbooks",
  },
  {
    id: "8",
    title: "Marketing Strategy Toolkit",
    description: "Complete marketing strategy framework with templates and worksheets.",
    price: 75,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    fileType: "ZIP",
    educator: "Maria Garcia",
    downloads: 356,
    category: "Resources",
  },
];

const categories = ["All Products", "Templates", "Guides & Playbooks", "Tools & Software", "Resources"];
const priceRanges = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25-$50", min: 25, max: 50 },
  { label: "$50-$100", min: 50, max: 100 },
  { label: "$100+", min: 100, max: Infinity },
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

export default function Products() {
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Products"]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useState(() => {
    setTimeout(() => setLoading(false), 1000);
  });

  const handleCategoryToggle = (category: string) => {
    if (category === "All Products") {
      setSelectedCategories(["All Products"]);
    } else {
      setSelectedCategories((prev) => {
        const filtered = prev.filter((c) => c !== "All Products");
        if (filtered.includes(category)) {
          const newCategories = filtered.filter((c) => c !== category);
          return newCategories.length === 0 ? ["All Products"] : newCategories;
        }
        return [...filtered, category];
      });
    }
  };

  const handlePriceRangeToggle = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const filteredProducts = mockProducts.filter((product) => {
    // Category filter
    const categoryMatch =
      selectedCategories.includes("All Products") || selectedCategories.includes(product.category);

    // Price filter
    const priceMatch =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((rangeLabel) => {
        const range = priceRanges.find((r) => r.label === rangeLabel);
        if (!range) return false;
        return product.price >= range.min && product.price < range.max;
      });

    return categoryMatch && priceMatch;
  });

  const handleBuyNow = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setShowPaymentModal(true);
  };

  const handlePurchase = () => {
    setShowPaymentModal(false);
    toast({
      title: "Purchase Successful!",
      description: "Your product has been added to My Purchases. Check your email for the download link.",
    });
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-12 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Digital Products & Templates</h1>
            <p className="text-xl text-muted-foreground">
              Download proven resources to accelerate your journey
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Filters */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Category</Label>
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <label
                          htmlFor={category}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Price Range Filters */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Price Range</Label>
                    {priceRanges.map((range) => (
                      <div key={range.label} className="flex items-center space-x-2">
                        <Checkbox
                          id={range.label}
                          checked={selectedPriceRanges.includes(range.label)}
                          onCheckedChange={() => handlePriceRangeToggle(range.label)}
                        />
                        <label
                          htmlFor={range.label}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  <>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="aspect-video w-full" />
                        <CardHeader>
                          <Skeleton className="h-5 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                        </CardContent>
                        <CardFooter className="flex items-center justify-between">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-9 w-24" />
                        </CardFooter>
                      </Card>
                    ))}
                  </>
                ) : filteredProducts.map((product) => {
                  const FileIcon = getFileIcon(product.fileType);
                  return (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          <FileIcon className="h-3 w-3 mr-1" />
                          {product.fileType}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">By {product.educator}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Download className="h-4 w-4" />
                          <span>{product.downloads} downloads</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                        <Button onClick={() => handleBuyNow(product)}>Buy Now</Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && !loading && (
                <EmptyProducts 
                  message="No products match your filters"
                  description="Try adjusting your filters to see more products"
                  showAction={false}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Purchase</DialogTitle>
            <DialogDescription>Review your order details</DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedProduct.thumbnail}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{selectedProduct.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Price</span>
                  <span className="text-2xl font-bold text-primary">${selectedProduct.price}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Complete Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
