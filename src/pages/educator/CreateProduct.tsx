import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, DollarSign } from "lucide-react";

const categories = ["Templates", "Guides", "Tools", "Resources", "Other"];

export default function CreateProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublish = () => {
    // Validate required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !productFile
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all required fields and upload a product file.",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (price < 5 || price > 500) {
      toast({
        title: "Invalid Price",
        description: "Price must be between $5 and $500.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Product Published!",
      description: "Students can now purchase it.",
    });
    navigate("/educator/products");
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your product has been saved as a draft.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload a Digital Product</h1>
          <p className="text-muted-foreground">
            Create and publish your digital product for students
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Enter information about your digital product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter product title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product and what students will learn or gain..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={5}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      min="5"
                      max="500"
                      step="0.01"
                      placeholder="5.00"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Price range: $5 - $500
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Thumbnail Image */}
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setThumbnailFile(e.target.files?.[0] || null)
                      }
                    />
                    <label htmlFor="thumbnail" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      {thumbnailFile ? (
                        <p className="text-sm font-medium">
                          {thumbnailFile.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm font-medium">
                            Click to upload thumbnail
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 5MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Product File */}
                <div className="space-y-2">
                  <Label htmlFor="productFile">Product File *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="productFile"
                      type="file"
                      accept=".pdf,.docx,.xlsx,.zip"
                      className="hidden"
                      onChange={(e) =>
                        setProductFile(e.target.files?.[0] || null)
                      }
                    />
                    <label htmlFor="productFile" className="cursor-pointer">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      {productFile ? (
                        <p className="text-sm font-medium">
                          {productFile.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm font-medium">
                            Click to upload product file
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOCX, XLSX, ZIP (max 50MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="flex-1"
              >
                Save as Draft
              </Button>
              <Button
                onClick={handlePublish}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Publish Product
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How your product will appear in the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Card className="overflow-hidden">
                  {/* Thumbnail Preview */}
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {thumbnailFile ? (
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No thumbnail uploaded
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Product Info Preview */}
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {formData.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                          {formData.category}
                        </span>
                      )}
                      <h3 className="font-semibold text-lg">
                        {formData.title || "Product Title"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.description ||
                          "Product description will appear here..."}
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {formData.price
                            ? `$${parseFloat(formData.price).toFixed(2)}`
                            : "$0.00"}
                        </span>
                        <Button size="sm" disabled>
                          Purchase
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
