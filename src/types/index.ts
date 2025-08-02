// Shared types across the application


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

export interface MonitoringData {
  date: string;
  monitoringMedia: [MediaFile];
  uploadedVideo: string;
}

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
  siteId: string;
  siteName: string;
  siteLocation?: string | SiteLocation;
  commonNames?: string[];
  siteImages?: string[];
  siteType?: string;
  monitoringData?: MonitoringData[];
  excelFiles?: ExcelFile[];
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



// excel utils

export type ExcelValue = string | number | boolean | Date | null | string;

export interface ExcelData {
  headers: string[];
  rows: ExcelValue[][];
}

export interface Sheet {
  sheetName: string;
  headers: string[];
  rows: ExcelValue[][];
}


export interface ExcelStats {
  rowCount: number;
  columnCount: number;
  columnNames: string[];
  firstRow: ExcelValue[] | null;
  lastRow: ExcelValue[] | null;
}

export interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

// Interface for the parsed Excel result including both data and stats
export interface ParsedExcelResult {
    data: ExcelData;
    stats: ExcelStats;
}

// Error type for parsing issues
export interface ExcelParseError {
    error: string;
}
