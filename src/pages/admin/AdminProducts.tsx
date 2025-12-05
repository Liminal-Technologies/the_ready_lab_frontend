import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Eye,
  Download,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  product_type: string;
  price: number;
  downloads_count: number;
  purchases_count?: number;
  created_at: string;
  tags?: string[];
}

const mockProducts: DigitalProduct[] = [
  { id: "1", title: "Business Plan Template Pack", description: "Complete business plan templates for startups", product_type: "template", price: 49, downloads_count: 234, purchases_count: 89, created_at: "2024-11-15", tags: ["business", "startup"] },
  { id: "2", title: "Marketing Strategy E-book", description: "Comprehensive guide to digital marketing", product_type: "ebook", price: 29, downloads_count: 412, purchases_count: 156, created_at: "2024-10-20", tags: ["marketing", "strategy"] },
  { id: "3", title: "Financial Modeling Worksheets", description: "Excel templates for financial projections", product_type: "worksheet", price: 39, downloads_count: 178, purchases_count: 67, created_at: "2024-09-10", tags: ["finance", "excel"] },
  { id: "4", title: "Leadership Fundamentals Course", description: "Video course on effective leadership", product_type: "course", price: 99, downloads_count: 89, purchases_count: 45, created_at: "2024-08-05", tags: ["leadership", "management"] },
  { id: "5", title: "Social Media Calendar Template", description: "12-month content planning template", product_type: "template", price: 19, downloads_count: 567, purchases_count: 234, created_at: "2024-07-22", tags: ["social media", "planning"] },
];

export function AdminProducts() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, typeFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('digital_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    const dataSource = products.length > 0 ? products : mockProducts;
    let filtered = dataSource;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(product => product.product_type === typeFilter);
    }

    setFilteredProducts(filtered);
  };

  const displayProducts = products.length > 0 ? filteredProducts : 
    (searchTerm || typeFilter !== "all" ? filteredProducts : mockProducts);

  const analyticsData = {
    totalProducts: 28,
    productsPurchased: 156,
    totalRevenue: 4890,
    totalDownloads: 1480
  };

  const getTypeBadge = (type: string) => (
    <Badge variant="outline">
      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Digital Products</h1>
        <p className="text-muted-foreground">
          Platform-wide digital product analytics and performance
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">+4</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Purchased</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.productsPurchased}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">+23</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">+$890</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">+156</span> this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Type Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-products"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ebook">E-book</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="worksheet">Worksheet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table - Read Only */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({displayProducts.length})</CardTitle>
          <CardDescription>
            View product performance and download statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            {searchTerm && displayProducts.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">No products match "{searchTerm}"</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Purchases</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayProducts.map((product) => (
                    <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </div>
                          {product.tags && (
                            <div className="flex gap-1 mt-1">
                              {product.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(product.product_type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {product.price}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {product.purchases_count || Math.floor(product.downloads_count * 0.4)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {product.downloads_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                          <TrendingUp className="h-3 w-3" />
                          ${(product.purchases_count || Math.floor(product.downloads_count * 0.4)) * product.price}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" data-testid={`button-view-product-${product.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Phase 2 Notice */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium">Product Approval Workflow</h3>
              <p className="text-sm text-muted-foreground">
                Product review and approval controls will be available in Phase 2
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
