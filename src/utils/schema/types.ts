// Schema type definitions for type safety across all schema generators

export interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

export interface SoftwareApplicationSchema {
  name: string;
  applicationCategory: 'BusinessApplication' | 'DeveloperApplication';
  operatingSystem?: string;
  offers: {
    price: string | number;
    priceCurrency: string;
    priceValidUntil?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  featureList?: string[];
  screenshot?: string[];
}

export interface HowToSchema {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration format (PT30M = 30 minutes)
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: Array<{
    name: string;
    image?: string;
  }>;
  tool?: Array<{
    name: string;
    image?: string;
  }>;
  step: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
    position: number;
  }>;
}

export interface FAQItem {
  question: string;
  answer: string;
  position?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  position: number;
}

export interface DatasetSchema {
  name: string;
  description: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  creator?: {
    type: 'Organization' | 'Person';
    name: string;
  };
  distribution?: {
    contentUrl: string;
    encodingFormat: string;
  };
}

export interface ComparisonItem {
  name: string;
  description?: string;
  properties: Record<string, string | number | boolean>;
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    type: 'Person' | 'Organization';
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
  wordCount?: number;
  articleSection?: string;
}
