// Shared types across the application

export interface SiteLocation {
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Site {
  _id: string;
  siteName: string;
  siteLocation?: string | SiteLocation;
  commonNames?: string[];
  siteImages?: string[];
  siteType?: string;
  createdAt?: string;
  __v?: number;
  monitoring?: boolean;
}

export interface ExcelFile {
  originalName: string;
  url: string;
  uploadedAt: string;
}

export interface MediaFile {
  _id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  path: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  brand: string;
  agency: string;
  industry: string;
  campaignType: string;
  sites: Site[];
  mediaFiles?: MediaFile[];
  excelFiles?: ExcelFile[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CampaignFormData extends Omit<Campaign, '_id' | 'createdAt' | '__v' | 'monitoring'> {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  brand: string;
  agency: string;
  industry: string;
  campaignType: string;
  sites: Site[];
}

export interface SiteFormData {
  siteName: string;
  commonNames: string[];
  siteImages: string[];
  siteType: string;
  siteLocation: SiteLocation;
}
