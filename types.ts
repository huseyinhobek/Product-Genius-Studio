
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export type BusinessType = 
  | 'Electronics' 
  | 'Footwear' 
  | 'Fashion' 
  | 'Lingerie' 
  | 'Handbags' 
  | 'Jewelry' 
  | 'Accessories' 
  | 'HomeDecor' 
  | 'Cosmetics';

export type SceneStyle = 
  | 'Studio' 
  | 'Lifestyle' 
  | 'Nature' 
  | 'Luxury' 
  | 'Minimalist' 
  | 'Urban';

export type ImageQuality = '1K' | '2K' | '4K';

export type PackageType = 'free' | '1m' | '3m' | '6m' | '12m';

export interface GeneratedProduct {
  id: string;
  data: string;
  originalImage?: string;
  prompt: string;
  timestamp: number;
  businessType: BusinessType;
  style: SceneStyle;
  quality: ImageQuality;
}

// Added GeneratedImage type used in Infographic.tsx to resolve missing export error
export type GeneratedImage = GeneratedProduct;

// Added SearchResultItem type used in SearchResults.tsx to resolve missing export error
export interface SearchResultItem {
  url: string;
  title: string;
}

export type UserRole = 'business' | 'admin';

export interface User {
  id: string;
  email: string;
  businessName: string;
  role: UserRole;
  credits: number;
  package: PackageType;
  expiryDate: string | null; // ISO string
  paymentPending: boolean;
  requestedPackage: PackageType | null;
}

export type AppView = 'landing' | 'auth' | 'dashboard' | 'admin';

/**
 * Interface representing the AI Studio global API for key management.
 * Defining this as a named interface inside declare global ensures it merges with existing declarations.
 */
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    /**
     * Fixed: Property 'aistudio' must be of type 'AIStudio' to match existing environment declarations.
     * Structural matching is not sufficient for merged declarations of global properties.
     * Added optionality (?) to match existing environment modifiers and resolve conflicting declaration errors.
     */
    aistudio?: AIStudio;
  }
}
