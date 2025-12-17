import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useMockAuth } from '@/hooks/useMockAuth';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  FileText, 
  DollarSign, 
  Upload, 
  Eye,
  X,
  Download,
  Package
} from 'lucide-react';
import { 
  saveEducatorProduct, 
  type DigitalProduct 
} from '@/utils/educatorProductsStorage';

interface DigitalProductWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductCreated?: () => void;
  editingProduct?: DigitalProduct | null;
}

const PRODUCT_TYPES = [
  { value: 'template', label: 'Template', description: 'Editable document templates' },
  { value: 'guide', label: 'Guide', description: 'Step-by-step guides and tutorials' },
  { value: 'toolkit', label: 'Toolkit', description: 'Collection of tools and resources' },
  { value: 'worksheet', label: 'Worksheet', description: 'Fillable worksheets' },
  { value: 'checklist', label: 'Checklist', description: 'Task checklists and planners' },
  { value: 'ebook', label: 'eBook', description: 'Digital books and publications' },
  { value: 'other', label: 'Other', description: 'Other digital products' },
] as const;

const CATEGORIES = [
  'Business',
  'Marketing',
  'Finance',
  'Nonprofit',
  'Technology',
  'Design',
  'Education',
  'Health & Wellness',
  'Other',
];

const STEPS = [
  { id: 1, title: 'Product Details', icon: FileText },
  { id: 2, title: 'Pricing', icon: DollarSign },
  { id: 3, title: 'Upload File', icon: Upload },
  { id: 4, title: 'Preview & Publish', icon: Eye },
];

export const DigitalProductWizard = ({ 
  open, 
  onOpenChange, 
  onProductCreated,
  editingProduct 
}: DigitalProductWizardProps) => {
  const { toast } = useToast();
  const { user, isDemo } = useMockAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    productType: '' as DigitalProduct['productType'] | '',
    tags: '',
    isFree: true,
    price: 0,
    fileName: '',
    fileSize: 0,
    fileType: '',
    fileUrl: '',
    thumbnail: '',
    previewUrl: '',
  });

  useEffect(() => {
    if (open) {
      if (editingProduct) {
        setFormData({
          title: editingProduct.title,
          description: editingProduct.description,
          category: editingProduct.category,
          productType: editingProduct.productType,
          tags: editingProduct.tags.join(', '),
          isFree: editingProduct.pricing.type === 'free',
          price: editingProduct.pricing.amount || 0,
          fileName: editingProduct.file.name,
          fileSize: editingProduct.file.size,
          fileType: editingProduct.file.type,
          fileUrl: editingProduct.file.url,
          thumbnail: editingProduct.thumbnail || '',
          previewUrl: editingProduct.previewUrl || '',
        });
      } else if (isDemo) {
        setFormData({
          title: 'Startup Financial Model',
          description: 'A comprehensive Excel-based financial model for startups. Includes revenue projections, expense tracking, cash flow analysis, and investor-ready charts. Perfect for pitch deck preparation and fundraising.',
          category: 'Finance',
          productType: 'template',
          tags: 'startup, finance, fundraising, excel',
          isFree: false,
          price: 39,
          fileName: 'startup-financial-model.xlsx',
          fileSize: 156000,
          fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          fileUrl: '/demo/startup-financial-model.xlsx',
          thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
          previewUrl: '',
        });
      }
      setCurrentStep(1);
    }
  }, [open, editingProduct, isDemo]);

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      productType: '',
      tags: '',
      isFree: true,
      price: 0,
      fileName: '',
      fileSize: 0,
      fileType: '',
      fileUrl: '',
      thumbnail: '',
      previewUrl: '',
    });
    setCurrentStep(1);
    onOpenChange(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: URL.createObjectURL(file),
      });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.title && !!formData.description && !!formData.category && !!formData.productType;
      case 2:
        return formData.isFree || (formData.price >= 1 && formData.price <= 500);
      case 3:
        return !!formData.fileName && !!formData.fileUrl;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePublish = async (asDraft: boolean = false) => {
    setIsSubmitting(true);
    
    try {
      const product: DigitalProduct = {
        id: editingProduct?.id || `product-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        productType: formData.productType as DigitalProduct['productType'],
        pricing: {
          type: formData.isFree ? 'free' : 'paid',
          amount: formData.isFree ? undefined : formData.price,
        },
        file: {
          name: formData.fileName,
          size: formData.fileSize,
          type: formData.fileType,
          url: formData.fileUrl,
        },
        thumbnail: formData.thumbnail,
        previewUrl: formData.previewUrl,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        published: !asDraft,
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        educatorId: user?.id || 'educator-1',
        educatorName: user?.fullName || 'Educator',
        downloadCount: editingProduct?.downloadCount || 0,
        purchaseCount: editingProduct?.purchaseCount || 0,
        revenue: editingProduct?.revenue || 0,
      };
      
      saveEducatorProduct(product);
      
      toast({
        title: asDraft ? "Draft Saved" : "Product Published!",
        description: asDraft 
          ? "Your product has been saved as a draft."
          : "Your digital product is now available for students.",
      });
      
      onProductCreated?.();
      handleClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const progress = (currentStep / 4) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-product-wizard">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {editingProduct ? 'Edit Digital Product' : 'Create Digital Product'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 px-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    currentStep >= step.id 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <Progress value={progress} className="h-2" />

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Business Plan Template"
                  data-testid="input-product-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what's included and how it helps customers..."
                  rows={4}
                  data-testid="input-product-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger data-testid="select-product-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type *</Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(value) => setFormData({ ...formData, productType: value as DigitalProduct['productType'] })}
                  >
                    <SelectTrigger data-testid="select-product-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., business, startup, planning"
                  data-testid="input-product-tags"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h3 className="font-semibold text-lg">How do you want to offer this product?</h3>
                <p className="text-sm text-muted-foreground">Choose how students will access your digital product</p>
              </div>

              <Card className={`cursor-pointer transition-all ${
                formData.isFree ? 'ring-2 ring-primary bg-primary/5' : ''
              }`} onClick={() => setFormData({ ...formData, isFree: true })}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        formData.isFree ? 'bg-green-500 text-white' : 'bg-muted'
                      }`}>
                        <Download className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Free Download</h3>
                        <p className="text-sm text-muted-foreground">
                          Build your audience with a free resource
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.isFree}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
                      data-testid="switch-free-product"
                    />
                  </div>
                  {formData.isFree && (
                    <div className="mt-4 pt-4 border-t border-dashed space-y-2">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">What happens when a student gets this product:</p>
                      <ul className="text-sm text-muted-foreground space-y-1.5">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>Instant download access - no payment required</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>Product saved to their "My Products" library for re-download</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>Great for lead magnets and building your email list</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${
                !formData.isFree ? 'ring-2 ring-primary bg-primary/5' : ''
              }`} onClick={() => setFormData({ ...formData, isFree: false })}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        !formData.isFree ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Paid Product</h3>
                        <p className="text-sm text-muted-foreground">
                          Earn revenue from your expertise
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!formData.isFree}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFree: !checked })}
                      data-testid="switch-paid-product"
                    />
                  </div>
                  
                  {!formData.isFree && (
                    <div className="mt-4 pt-4 border-t border-dashed space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Set Your Price (USD) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="price"
                            type="number"
                            min="1"
                            max="500"
                            step="1"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            className="pl-10 text-lg font-semibold"
                            placeholder="29"
                            data-testid="input-product-price"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Price range: $1 - $500. Platform fees apply based on your plan.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-primary">What happens when a student purchases:</p>
                        <ul className="text-sm text-muted-foreground space-y-1.5">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>Secure checkout via Stripe - instant payment</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>Immediate download access after purchase</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>Product saved to their "My Products" library forever</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>Purchase confirmation email with download link</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Product File *</Label>
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    id="productFile"
                    type="file"
                    accept=".pdf,.docx,.xlsx,.zip,.pptx"
                    className="hidden"
                    onChange={handleFileSelect}
                    data-testid="input-product-file"
                  />
                  <label htmlFor="productFile" className="cursor-pointer">
                    {formData.fileName ? (
                      <div className="space-y-2">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <p className="font-medium">{formData.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(formData.fileSize)}
                        </p>
                        <Button type="button" variant="outline" size="sm">
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="font-medium">Click to upload your product file</p>
                        <p className="text-sm text-muted-foreground">
                          PDF, DOCX, XLSX, PPTX, or ZIP (max 50MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image URL (optional)</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  data-testid="input-product-thumbnail"
                />
                <p className="text-xs text-muted-foreground">
                  Add a cover image to make your product stand out
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="previewUrl">Preview File URL (optional)</Label>
                <Input
                  id="previewUrl"
                  value={formData.previewUrl}
                  onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
                  placeholder="https://example.com/preview.pdf"
                  data-testid="input-product-preview"
                />
                <p className="text-xs text-muted-foreground">
                  Add a preview file so customers can see what they're getting
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Product Preview</h3>
              
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {formData.thumbnail ? (
                    <img
                      src={formData.thumbnail}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Package className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No thumbnail</p>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{formData.category}</Badge>
                    <Badge variant="outline">
                      {PRODUCT_TYPES.find(t => t.value === formData.productType)?.label}
                    </Badge>
                    {formData.isFree ? (
                      <Badge className="bg-green-500">Free</Badge>
                    ) : (
                      <Badge className="bg-primary">${formData.price}</Badge>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-xl">{formData.title || 'Product Title'}</h3>
                  
                  <p className="text-muted-foreground line-clamp-3">
                    {formData.description || 'Product description...'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {formData.fileName}
                    </div>
                    <span>{formatFileSize(formData.fileSize)}</span>
                  </div>
                  
                  {formData.tags && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.split(',').map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-lg p-4 border">
                <h4 className="font-medium mb-2">Ready to publish?</h4>
                <p className="text-sm text-muted-foreground">
                  Once published, your product will be available for students to 
                  {formData.isFree ? ' download for free' : ` purchase for $${formData.price}`}.
                  You can edit or unpublish it at any time.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? handleClose : handleBack}
              disabled={isSubmitting}
            >
              {currentStep === 1 ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </>
              )}
            </Button>

            <div className="flex gap-2">
              {currentStep === 4 && (
                <Button
                  variant="outline"
                  onClick={() => handlePublish(true)}
                  disabled={isSubmitting}
                  data-testid="button-save-draft"
                >
                  Save as Draft
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button onClick={handleNext} data-testid="button-next-step">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={() => handlePublish(false)} 
                  disabled={isSubmitting}
                  data-testid="button-publish-product"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Product'}
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
