export type UserRole = 'owner' | 'admin';

export type OwnerTab = 'business' | 'leads' | 'reviews' | 'analytics' | 'settings';
export type AdminTab = 'overview' | 'businesses' | 'leads' | 'reviews' | 'more';

export interface BusinessListing {
  id: string;
  name: string;
  owner: string;
  category: string;
  location: string;
  phone: string;
  status: 'Active' | 'Pending' | 'Rejected' | 'Draft' | 'Suspended';
  timeAgo: string;
  rating?: number;
  reviewsCount?: number;
  views?: number;
  enquiries?: number;
  description?: string;
  verified?: boolean;
  alternatePhone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  logo?: string;
  images?: string[];
  services?: string[];
  address?: Record<string, string>;
  averageRating?: number;
  workingHours?: { day: string; isClosed?: boolean; opens?: string; closes?: string }[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Converted';
  timestamp: string;
  message: string;
  targetBusiness: string;
  notes?: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  comment: string;
  verified: boolean;
  reply?: string;
  replyDate?: string;
}

export type TimeRange = '7D' | '30D' | '3M' | '1Y';

export type OwnerMetricDimension = 'Views' | 'Enquiries' | 'Calls' | 'Website Clicks';
