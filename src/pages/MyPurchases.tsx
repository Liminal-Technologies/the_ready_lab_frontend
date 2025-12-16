import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Purchase {
  id: string;
  product_id: string;
  amount: number;
  status: string;
  purchased_at: string;
  digital_products: {
    title: string;
    description: string;
    file_url: string;
    product_type: string;
    thumbnail_url: string;
  };
}

export default function MyPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch purchases via API
      const purchasesData = await api.purchases.list(user.id);

      // Map to expected format with product details
      const mappedPurchases = (purchasesData || [])
        .filter((p: any) => p.status === 'completed')
        .map((purchase: any) => ({
          id: purchase.id,
          product_id: purchase.product_id || purchase.productId,
          amount: purchase.amount || 0,
          status: purchase.status,
          purchased_at: purchase.created_at || purchase.purchased_at,
          digital_products: purchase.product || {
            title: 'Unknown Product',
            description: '',
            file_url: '',
            product_type: 'unknown',
            thumbnail_url: '',
          },
        }));

      setPurchases(mappedPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your purchases.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // In a real implementation, you'd want to generate a signed URL
      // or use a download endpoint that verifies ownership
      window.open(fileUrl, '_blank');
      
      toast({
        title: 'Download started',
        description: 'Your file download has started.',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download the file.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">My Purchases</h1>
          <p className="text-muted-foreground">
            Access all your purchased digital products
          </p>
        </div>
      </div>

      {purchases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
            <p className="text-muted-foreground mb-4">
              Explore our marketplace to find digital products
            </p>
            <Button onClick={() => window.location.href = '/explore'}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="overflow-hidden">
              {purchase.digital_products.thumbnail_url && (
                <div className="aspect-video bg-muted">
                  <img
                    src={purchase.digital_products.thumbnail_url}
                    alt={purchase.digital_products.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">
                    {purchase.digital_products.title}
                  </CardTitle>
                  <Badge variant="secondary">
                    {purchase.digital_products.product_type}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {purchase.digital_products.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Purchased</span>
                  <span className="font-medium">
                    {new Date(purchase.purchased_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    ${purchase.amount.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() =>
                    handleDownload(
                      purchase.digital_products.file_url,
                      purchase.digital_products.title
                    )
                  }
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
