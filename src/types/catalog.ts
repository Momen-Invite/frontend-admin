export interface EventCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventProduct {
  id: number;
  categoryId: number;
  categoryName?: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  description?: string | null;
  previewUrl?: string | null;
  thumbnailUrl: string;
  isActive: boolean;
  isPopular: boolean;
  themeConfig?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventAsset {
  id: number;
  productId: number;
  assetType: "image" | "audio" | "font" | "json";
  name: string;
  assetUrl: string;
  fileSizeBytes: number;
  createdAt: string;
}
