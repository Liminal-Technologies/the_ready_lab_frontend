import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

// Map Stripe product IDs to platform fee percentages
const PLATFORM_FEE_BY_PRODUCT: Record<string, number> = {
  // Starter plan: 10% fee
  prod_starter: 10,
  // Professional plan: 6% fee
  prod_professional: 6,
  // Enterprise plan: 0% fee
  prod_enterprise: 0,
};

const DEFAULT_PLATFORM_FEE = 10; // Default for users without subscription

interface UploadDigitalProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const productTypes = [
  "Template",
  "Guide",
  "Toolkit",
  "Worksheet",
  "Checklist",
  "Report",
  "Other",
];

export const UploadDigitalProductModal = ({
  open,
  onOpenChange,
  onSuccess,
}: UploadDigitalProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    product_type: "",
    price: 0,
    is_free: true,
    file_url: "",
    preview_url: "",
    thumbnail_url: "",
    tags: [] as string[],
  });
  const { toast } = useToast();
  const { subscription } = useSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Determine platform fee based on educator's subscription tier
      const platformFee = subscription.product_id
        ? PLATFORM_FEE_BY_PRODUCT[subscription.product_id] ||
          DEFAULT_PLATFORM_FEE
        : DEFAULT_PLATFORM_FEE;

      const { error } = await supabase.from("digital_products").insert({
        title: formData.title,
        description: formData.description,
        product_type: formData.product_type,
        price: formData.is_free ? 0 : formData.price,
        file_url: formData.file_url,
        preview_url: formData.preview_url,
        thumbnail_url: formData.thumbnail_url,
        tags: formData.tags,
        educator_id: user.id,
        status: "pending",
        platform_fee_percentage: platformFee,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Digital product uploaded. Awaiting admin approval.",
      });

      onSuccess?.();
      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        product_type: "",
        price: 0,
        is_free: true,
        file_url: "",
        preview_url: "",
        thumbnail_url: "",
        tags: [],
      });
    } catch (error) {
      console.error("Error uploading product:", error);
      toast({
        title: "Error",
        description: "Failed to upload product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Digital Product</DialogTitle>
          <DialogDescription>
            Upload a digital product to sell or share for free
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Nonprofit Grant Template"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your product..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_type">Product Type *</Label>
            <Select
              value={formData.product_type}
              onValueChange={(value) =>
                setFormData({ ...formData, product_type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Free Product</Label>
              <p className="text-sm text-muted-foreground">
                Make this product free to download
              </p>
            </div>
            <Switch
              checked={formData.is_free}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_free: checked })
              }
            />
          </div>

          {!formData.is_free && (
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                required={!formData.is_free}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="file_url">File URL *</Label>
            <Input
              id="file_url"
              value={formData.file_url}
              onChange={(e) =>
                setFormData({ ...formData, file_url: e.target.value })
              }
              placeholder="https://example.com/file.pdf"
              required
            />
            <p className="text-xs text-muted-foreground">
              Upload your file to cloud storage and paste the URL here
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preview_url">Preview URL</Label>
            <Input
              id="preview_url"
              value={formData.preview_url}
              onChange={(e) =>
                setFormData({ ...formData, preview_url: e.target.value })
              }
              placeholder="https://example.com/preview.pdf"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(",").map((t) => t.trim()),
                })
              }
              placeholder="nonprofit, fundraising, template"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Product
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
