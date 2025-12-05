export interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  productType: "template" | "guide" | "toolkit" | "worksheet" | "checklist" | "ebook" | "other";
  
  pricing: {
    type: "free" | "paid";
    amount?: number;
  };
  
  file: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
  
  thumbnail?: string;
  previewUrl?: string;
  tags: string[];
  
  published: boolean;
  createdAt: string;
  updatedAt: string;
  
  educatorId: string;
  educatorName: string;
  
  downloadCount: number;
  purchaseCount: number;
  revenue: number;
}

export interface ProductPurchase {
  id: string;
  productId: string;
  productTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  purchasedAt: string;
  amount: number;
  downloadedAt?: string;
}

const STORAGE_KEYS = {
  PRODUCTS: "educator_products",
  PURCHASES: "product_purchases",
};

export function getAllEducatorProducts(): DigitalProduct[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading educator products:", error);
    return [];
  }
}

export function getAllPublishedProducts(): DigitalProduct[] {
  return getAllEducatorProducts().filter(product => product.published);
}

export function getEducatorProductById(productId: string): DigitalProduct | null {
  const products = getAllEducatorProducts();
  return products.find((product) => product.id === productId) || null;
}

export function saveEducatorProduct(product: DigitalProduct): void {
  try {
    const products = getAllEducatorProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    
    if (existingIndex >= 0) {
      products[existingIndex] = {
        ...product,
        updatedAt: new Date().toISOString(),
      };
    } else {
      products.push({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving educator product:", error);
  }
}

export function deleteEducatorProduct(productId: string): boolean {
  try {
    const products = getAllEducatorProducts();
    const filteredProducts = products.filter((p) => p.id !== productId);
    
    if (filteredProducts.length === products.length) {
      return false;
    }
    
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filteredProducts));
    return true;
  } catch (error) {
    console.error("Error deleting educator product:", error);
    return false;
  }
}

export function toggleProductPublished(productId: string): boolean {
  const products = getAllEducatorProducts();
  const productIndex = products.findIndex((p) => p.id === productId);
  
  if (productIndex === -1) {
    throw new Error("Product not found");
  }
  
  const product = products[productIndex];
  
  if (!product.published) {
    if (!product.title || !product.description || !product.file?.url) {
      throw new Error("Product must have title, description, and file to publish");
    }
  }
  
  products[productIndex] = {
    ...product,
    published: !product.published,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return products[productIndex].published;
}

export function duplicateEducatorProduct(productId: string): DigitalProduct | null {
  try {
    const product = getEducatorProductById(productId);
    if (!product) return null;
    
    const duplicatedProduct: DigitalProduct = {
      ...product,
      id: `product-${Date.now()}`,
      title: `${product.title} (Copy)`,
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadCount: 0,
      purchaseCount: 0,
      revenue: 0,
    };
    
    saveEducatorProduct(duplicatedProduct);
    return duplicatedProduct;
  } catch (error) {
    console.error("Error duplicating product:", error);
    return null;
  }
}

export function getAllProductPurchases(): ProductPurchase[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading product purchases:", error);
    return [];
  }
}

export function getProductPurchasesByStudent(studentId: string): ProductPurchase[] {
  return getAllProductPurchases().filter((p) => p.studentId === studentId);
}

export function getProductPurchasesByProduct(productId: string): ProductPurchase[] {
  return getAllProductPurchases().filter((p) => p.productId === productId);
}

export function createProductPurchase(purchase: Omit<ProductPurchase, "id" | "purchasedAt">): ProductPurchase {
  try {
    const newPurchase: ProductPurchase = {
      ...purchase,
      id: `purchase-${Date.now()}`,
      purchasedAt: new Date().toISOString(),
    };
    
    const purchases = getAllProductPurchases();
    purchases.push(newPurchase);
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    
    const product = getEducatorProductById(purchase.productId);
    if (product) {
      product.purchaseCount = (product.purchaseCount || 0) + 1;
      product.downloadCount = (product.downloadCount || 0) + 1;
      product.revenue = (product.revenue || 0) + purchase.amount;
      saveEducatorProduct(product);
    }
    
    return newPurchase;
  } catch (error) {
    console.error("Error creating product purchase:", error);
    throw error;
  }
}

export function markProductDownloaded(purchaseId: string): void {
  try {
    const purchases = getAllProductPurchases();
    const purchaseIndex = purchases.findIndex((p) => p.id === purchaseId);
    
    if (purchaseIndex >= 0) {
      purchases[purchaseIndex].downloadedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    }
  } catch (error) {
    console.error("Error marking product downloaded:", error);
  }
}

export function getProductStats() {
  const products = getAllEducatorProducts();
  const purchases = getAllProductPurchases();
  
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const totalDownloads = products.reduce((sum, p) => sum + (p.downloadCount || 0), 0);
  const totalRevenue = products.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalPurchases = purchases.length;
  
  return {
    totalProducts,
    publishedProducts,
    totalDownloads,
    totalRevenue,
    totalPurchases,
  };
}

export function initializeDemoProducts(): void {
  const existingProducts = getAllEducatorProducts();
  if (existingProducts.length > 0) return;
  
  const demoProducts: DigitalProduct[] = [
    {
      id: "product-demo-1",
      title: "Business Plan Template",
      description: "A comprehensive business plan template with financial projections, market analysis sections, and executive summary guidelines. Perfect for startups and small businesses.",
      category: "Business",
      productType: "template",
      pricing: { type: "paid", amount: 29 },
      file: {
        name: "business-plan-template.docx",
        size: 245000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        url: "/demo/business-plan-template.docx",
      },
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      tags: ["business", "startup", "planning"],
      published: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      educatorId: "demo-educator",
      educatorName: "Dr. Sarah Chen",
      downloadCount: 156,
      purchaseCount: 89,
      revenue: 2581,
    },
    {
      id: "product-demo-2",
      title: "Grant Writing Toolkit",
      description: "Everything you need to write winning grant proposals. Includes templates, checklists, sample narratives, and a comprehensive guide to foundation research.",
      category: "Nonprofit",
      productType: "toolkit",
      pricing: { type: "paid", amount: 49 },
      file: {
        name: "grant-writing-toolkit.zip",
        size: 12500000,
        type: "application/zip",
        url: "/demo/grant-writing-toolkit.zip",
      },
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
      tags: ["nonprofit", "grants", "fundraising"],
      published: true,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      educatorId: "demo-educator",
      educatorName: "Dr. Sarah Chen",
      downloadCount: 234,
      purchaseCount: 178,
      revenue: 8722,
    },
    {
      id: "product-demo-3",
      title: "Social Media Content Calendar",
      description: "A 90-day social media content calendar with post ideas, hashtag strategies, and engagement tips. Includes templates for Instagram, LinkedIn, and Twitter.",
      category: "Marketing",
      productType: "template",
      pricing: { type: "free" },
      file: {
        name: "social-media-calendar.xlsx",
        size: 85000,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        url: "/demo/social-media-calendar.xlsx",
      },
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400",
      tags: ["marketing", "social media", "content"],
      published: true,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      educatorId: "demo-educator",
      educatorName: "Dr. Sarah Chen",
      downloadCount: 542,
      purchaseCount: 542,
      revenue: 0,
    },
  ];
  
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(demoProducts));
}
