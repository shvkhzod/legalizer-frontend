// /src/lib/utils/scraper.ts
import type { ScrapedData } from './types';

/**
 * Scrapes a website and returns structured compliance data.
 * @param url - The URL of the website to scan
 * @returns ScrapedData object with all findings
 */
export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  // Normalize URL
  const normalizedUrl = normalizeUrl(url);

  // Initialize result object
  const scrapedData: ScrapedData = {
    scannedUrl: normalizedUrl,
    usesSSL: false,
    foundPages: {
      privacy: null,
      cookie: null,
      safeguarding: null,
    },
    foundCopyright: false,
    paymentType: 'none',
    pecrCheck: 'unknown',
    foundGiftAid: false,
    privacyPolicyChecks: {
      mentionsDSAR: false,
      mentionsDataProcessors: false,
    },
  };

  try {
    // 1. Check SSL
    scrapedData.usesSSL = normalizedUrl.startsWith('https://');

    // 2. Fetch the homepage
    const homepageHtml = await fetchPage(normalizedUrl);

    // 3. Find policy pages by scanning links on homepage
    const links = extractLinks(homepageHtml, normalizedUrl);
    scrapedData.foundPages = findPolicyPages(links);

    // 4. Check for copyright notice
    scrapedData.foundCopyright = checkCopyright(homepageHtml);

    // 5. Check payment processing type
    scrapedData.paymentType = detectPaymentType(homepageHtml);

    // 6. Check for Gift Aid mentions
    scrapedData.foundGiftAid = checkGiftAid(homepageHtml);

    // 7. Check PECR compliance (email signup forms)
    scrapedData.pecrCheck = checkPECR(homepageHtml);

    // 8. If privacy policy found, analyze its contents
    if (scrapedData.foundPages.privacy) {
      const privacyHtml = await fetchPage(scrapedData.foundPages.privacy);
      scrapedData.privacyPolicyChecks = analyzePrivacyPolicy(privacyHtml);
    }

  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error(`Failed to scrape website: ${error}`);
  }

  return scrapedData;
}

/**
 * Normalize and validate URL
 */
function normalizeUrl(url: string): string {
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  // Remove trailing slash
  url = url.replace(/\/$/, '');

  return url;
}

/**
 * Fetch a page and return its HTML content
 */
async function fetchPage(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ComplianceChecker/1.0)',
      },
      // Follow redirects
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error}`);
  }
}

/**
 * Extract all links from HTML
 */
function extractLinks(html: string, baseUrl: string): string[] {
  const links: string[] = [];
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];

    // Convert relative URLs to absolute
    let absoluteUrl: string;
    if (href.startsWith('http://') || href.startsWith('https://')) {
      absoluteUrl = href;
    } else if (href.startsWith('/')) {
      const base = new URL(baseUrl);
      absoluteUrl = `${base.protocol}//${base.host}${href}`;
    } else if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
      continue; // Skip anchors and special links
    } else {
      absoluteUrl = `${baseUrl}/${href}`;
    }

    links.push(absoluteUrl);
  }

  return links;
}

/**
 * Find policy pages from a list of links
 */
function findPolicyPages(links: string[]): {
  privacy: string | null;
  cookie: string | null;
  safeguarding: string | null;
} {
  const result = {
    privacy: null as string | null,
    cookie: null as string | null,
    safeguarding: null as string | null,
  };

  for (const link of links) {
    const lowerLink = link.toLowerCase();

    // Privacy policy
    if (!result.privacy && (
      lowerLink.includes('privacy') ||
      lowerLink.includes('privacypolicy') ||
      lowerLink.includes('privacy-policy')
    )) {
      result.privacy = link;
    }

    // Cookie policy
    if (!result.cookie && (
      lowerLink.includes('cookie') ||
      lowerLink.includes('cookies')
    )) {
      result.cookie = link;
    }

    // Safeguarding policy
    if (!result.safeguarding && (
      lowerLink.includes('safeguarding') ||
      lowerLink.includes('child-protection') ||
      lowerLink.includes('childprotection')
    )) {
      result.safeguarding = link;
    }
  }

  return result;
}

/**
 * Check if the page contains a copyright notice
 */
function checkCopyright(html: string): boolean {
  const copyrightRegex = /&copy;|©|\(c\)|copyright/i;
  return copyrightRegex.test(html);
}

/**
 * Detect payment processing type (third-party, self-hosted, or none)
 */
function detectPaymentType(html: string): 'third-party' | 'self-hosted' | 'none' {
  const lowerHtml = html.toLowerCase();

  // Check for third-party payment processors
  const thirdPartyIndicators = [
    'stripe',
    'paypal',
    'square',
    'braintree',
    'worldpay',
    'sagepay',
    'checkout.com',
    'gocardless',
  ];

  for (const indicator of thirdPartyIndicators) {
    if (lowerHtml.includes(indicator)) {
      return 'third-party';
    }
  }

  // Check for payment forms (indicates potential self-hosted)
  const paymentFormIndicators = [
    'card-number',
    'cardnumber',
    'credit-card',
    'creditcard',
    'cvv',
    'cvc',
  ];

  for (const indicator of paymentFormIndicators) {
    if (lowerHtml.includes(indicator)) {
      return 'self-hosted';
    }
  }

  return 'none';
}

/**
 * Check if the page mentions Gift Aid
 */
function checkGiftAid(html: string): boolean {
  const giftAidRegex = /gift\s*aid/i;
  return giftAidRegex.test(html);
}

/**
 * Check PECR compliance (opt-in vs opt-out for email marketing)
 */
function checkPECR(html: string): 'opt-in' | 'opt-out' | 'unknown' {
  // Look for newsletter signup forms
  const newsletterRegex = /newsletter|subscribe|mailing.*list|email.*updates/i;

  if (!newsletterRegex.test(html)) {
    return 'unknown'; // No newsletter form found
  }

  // Look for checkboxes that might be pre-checked
  // This is a basic heuristic - real implementation would need more sophisticated parsing
  const checkedBoxRegex = /<input[^>]*type=["']checkbox["'][^>]*checked[^>]*newsletter/i;

  if (checkedBoxRegex.test(html)) {
    return 'opt-out'; // Pre-ticked box = opt-out = non-compliant
  }

  return 'opt-in'; // Assume opt-in if checkbox exists but not pre-checked
}

/**
 * Analyze privacy policy content for specific compliance elements
 */
function analyzePrivacyPolicy(html: string): {
  mentionsDSAR: boolean;
  mentionsDataProcessors: boolean;
} {
  const lowerHtml = html.toLowerCase();

  // Check for DSAR mentions
  const dsarKeywords = [
    'dsar',
    'data subject access request',
    'subject access request',
    'access your data',
    'request a copy of your data',
    'request your personal data',
  ];
  const mentionsDSAR = dsarKeywords.some(keyword => lowerHtml.includes(keyword));

  // Check for data processors mentions
  const processorKeywords = [
    'data processor',
    'third party processor',
    'third-party processor',
    'service provider',
    'data processing',
  ];
  const mentionsDataProcessors = processorKeywords.some(keyword => lowerHtml.includes(keyword));

  return {
    mentionsDSAR,
    mentionsDataProcessors,
  };
}
