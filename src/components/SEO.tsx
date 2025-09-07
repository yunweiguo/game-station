'use client';

import { useEffect } from 'react';
import { currentConfig } from '@/config/homepage';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  canonical 
}: SEOProps) {
  const seo = currentConfig.seo;
  
  const finalTitle = title || seo.title;
  const finalDescription = description || seo.description;
  const finalKeywords = keywords || seo.keywords;
  const finalOgTitle = ogTitle || seo.ogTitle || finalTitle;
  const finalOgDescription = ogDescription || seo.ogDescription || finalDescription;
  const finalOgImage = ogImage || seo.ogImage;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Basic meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords.join(', '));
    updateMetaTag('author', 'Game Station');
    updateMetaTag('robots', 'index, follow');
    
    // Open Graph tags
    updatePropertyTag('og:type', 'website');
    updatePropertyTag('og:title', finalOgTitle);
    updatePropertyTag('og:description', finalOgDescription);
    if (finalOgImage) updatePropertyTag('og:image', finalOgImage);
    updatePropertyTag('og:site_name', 'Game Station');
    updatePropertyTag('og:locale', 'en_US');
    
    // Twitter card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalOgTitle);
    updateMetaTag('twitter:description', finalOgDescription);
    if (finalOgImage) updateMetaTag('twitter:image', finalOgImage);
    updateMetaTag('twitter:site', '@GameStation');
    
    // Update canonical URL
    const finalCanonical = canonical || window.location.href;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalCanonical);
    
    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Game",
      "name": currentConfig.featuredGame.name,
      "description": finalDescription,
      "url": finalCanonical,
      "image": finalOgImage,
      "author": {
        "@type": "Organization",
        "name": "Game Station"
      },
      "gamePlatform": "Web Browser",
      "applicationCategory": "Game",
      "operatingSystem": "Any",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": currentConfig.featuredGame.rating,
        "ratingCount": currentConfig.featuredGame.play_count
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
    
    let scriptTag = document.querySelector('#structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('id', 'structured-data');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
    
  }, [finalTitle, finalDescription, finalKeywords, finalOgTitle, finalOgDescription, finalOgImage, canonical]);

  return null;
}