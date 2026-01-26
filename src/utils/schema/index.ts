import type {
  OrganizationSchema,
  SoftwareApplicationSchema,
  HowToSchema,
  FAQItem,
  BreadcrumbItem,
  DatasetSchema,
  ArticleSchema
} from './types';

/**
 * Base schema generator that creates the @graph structure
 * All sites use this as the foundation
 */
export class SchemaGenerator {
  private siteUrl: string;
  private siteName: string;
  private logoUrl: string;

  constructor(siteUrl: string, siteName: string, logoUrl: string) {
    this.siteUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash
    this.siteName = siteName;
    this.logoUrl = logoUrl;
  }

  /**
   * Generate organization schema (appears on all pages)
   */
  getOrganizationSchema(): object {
    return {
      "@type": "Organization",
      "@id": `${this.siteUrl}/#organization`,
      "name": this.siteName,
      "url": this.siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": this.logoUrl,
        "width": 200,
        "height": 60
      },
      "sameAs": [] // Add social profiles when available
    };
  }

  /**
   * Generate website schema (appears on all pages)
   */
  getWebSiteSchema(): object {
    return {
      "@type": "WebSite",
      "@id": `${this.siteUrl}/#website`,
      "url": this.siteUrl,
      "name": this.siteName,
      "publisher": {
        "@id": `${this.siteUrl}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${this.siteUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };
  }

  /**
   * Generate SoftwareApplication schema for product pages
   */
  getSoftwareApplicationSchema(data: SoftwareApplicationSchema, pageUrl: string): object {
    const schema: any = {
      "@type": "SoftwareApplication",
      "@id": `${pageUrl}#software`,
      "name": data.name,
      "applicationCategory": data.applicationCategory,
      "url": pageUrl,
      "offers": {
        "@type": "Offer",
        "price": data.offers.price,
        "priceCurrency": data.offers.priceCurrency,
        "availability": "https://schema.org/InStock"
      }
    };

    if (data.operatingSystem) {
      schema.operatingSystem = data.operatingSystem;
    }

    if (data.aggregateRating) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": data.aggregateRating.ratingValue,
        "ratingCount": data.aggregateRating.ratingCount,
        "bestRating": data.aggregateRating.bestRating || 5,
        "worstRating": data.aggregateRating.worstRating || 1
      };
    }

    if (data.featureList && data.featureList.length > 0) {
      schema.featureList = data.featureList;
    }

    if (data.screenshot && data.screenshot.length > 0) {
      schema.screenshot = data.screenshot.map(url => ({
        "@type": "ImageObject",
        "url": url
      }));
    }

    return schema;
  }

  /**
   * Generate HowTo schema for instructional content
   */
  getHowToSchema(data: HowToSchema, pageUrl: string): object {
    const schema: any = {
      "@type": "HowTo",
      "@id": `${pageUrl}#howto`,
      "name": data.name,
      "description": data.description,
      "step": data.step.map(step => ({
        "@type": "HowToStep",
        "position": step.position,
        "name": step.name,
        "text": step.text,
        "url": step.url || pageUrl,
        ...(step.image && { "image": step.image })
      }))
    };

    if (data.totalTime) {
      schema.totalTime = data.totalTime;
    }

    if (data.estimatedCost) {
      schema.estimatedCost = {
        "@type": "MonetaryAmount",
        "currency": data.estimatedCost.currency,
        "value": data.estimatedCost.value
      };
    }

    if (data.supply && data.supply.length > 0) {
      schema.supply = data.supply.map(item => ({
        "@type": "HowToSupply",
        "name": item.name,
        ...(item.image && { "image": item.image })
      }));
    }

    if (data.tool && data.tool.length > 0) {
      schema.tool = data.tool.map(item => ({
        "@type": "HowToTool",
        "name": item.name,
        ...(item.image && { "image": item.image })
      }));
    }

    return schema;
  }

  /**
   * Generate FAQPage schema
   */
  getFAQPageSchema(faqs: FAQItem[], pageUrl: string): object {
    return {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faqpage`,
      "mainEntity": faqs.map((faq, index) => ({
        "@type": "Question",
        "position": faq.position || index + 1,
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  /**
   * Generate BreadcrumbList schema
   */
  getBreadcrumbSchema(items: BreadcrumbItem[]): object {
    return {
      "@type": "BreadcrumbList",
      "@id": "#breadcrumb",
      "itemListElement": items.map(item => ({
        "@type": "ListItem",
        "position": item.position,
        "name": item.label,
        ...(item.href && { "item": `${this.siteUrl}${item.href}` })
      }))
    };
  }

  /**
   * Generate Article/BlogPosting schema
   */
  getArticleSchema(data: ArticleSchema, pageUrl: string, type: 'Article' | 'BlogPosting' = 'Article'): object {
    const schema: any = {
      "@type": type,
      "@id": pageUrl,
      "url": pageUrl,
      "headline": data.headline,
      "description": data.description,
      "datePublished": data.datePublished,
      "dateModified": data.dateModified || data.datePublished,
      "author": {
        "@type": data.author.type,
        "name": data.author.name,
        ...(data.author.url && { "url": data.author.url })
      },
      "publisher": {
        "@id": `${this.siteUrl}/#organization`
      },
      "isPartOf": {
        "@id": `${this.siteUrl}/#website`
      }
    };

    if (data.image) {
      schema.image = {
        "@type": "ImageObject",
        "url": data.image
      };
    }

    if (data.wordCount) {
      schema.wordCount = data.wordCount;
    }

    if (data.articleSection) {
      schema.articleSection = data.articleSection;
    }

    return schema;
  }

  /**
   * Generate Dataset schema for statistics pages
   */
  getDatasetSchema(data: DatasetSchema, pageUrl: string): object {
    const schema: any = {
      "@type": "Dataset",
      "@id": `${pageUrl}#dataset`,
      "name": data.name,
      "description": data.description,
      "url": data.url || pageUrl
    };

    if (data.datePublished) {
      schema.datePublished = data.datePublished;
    }

    if (data.dateModified) {
      schema.dateModified = data.dateModified;
    }

    if (data.creator) {
      schema.creator = {
        "@type": data.creator.type,
        "name": data.creator.name
      };
    }

    if (data.distribution) {
      schema.distribution = {
        "@type": "DataDownload",
        "contentUrl": data.distribution.contentUrl,
        "encodingFormat": data.distribution.encodingFormat
      };
    }

    return schema;
  }

  /**
   * Build complete JSON-LD with @graph structure
   * This is what gets injected into the page <head>
   */
  buildSchema(pageSchemas: object[]): string {
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        this.getOrganizationSchema(),
        this.getWebSiteSchema(),
        ...pageSchemas
      ]
    };

    return JSON.stringify(schema);
  }
}

/**
 * Factory function to create schema generator for each site
 */
export function createSchemaGenerator(site: 'mydojo' | 'petcare' | 'driveschool' | 'tattoo'): SchemaGenerator {
  const configs = {
    mydojo: {
      url: 'https://mydojo.software',
      name: 'MyDojo Software',
      logo: 'https://mydojo.software/logo.svg'
    },
    petcare: {
      url: 'https://petcare.software',
      name: 'PetCare Software',
      logo: 'https://petcare.software/logo.svg'
    },
    driveschool: {
      url: 'https://mydriveschool.software',
      name: 'MyDriveSchool Software',
      logo: 'https://mydriveschool.software/logo.svg'
    },
    tattoo: {
      url: 'https://mytattoo.software',
      name: 'MyTattoo Software',
      logo: 'https://mytattoo.software/logo.svg'
    }
  };

  const config = configs[site];
  return new SchemaGenerator(config.url, config.name, config.logo);
}
