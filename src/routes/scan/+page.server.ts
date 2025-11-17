// /src/routes/scan/+page.server.ts
import type { PageServerLoad } from './$types';
import type { ComplianceReport } from '$lib/utils/types';
import { scrapeWebsite } from '$lib/utils/scraper';
import { generateReport } from '$lib/utils/reportEngine';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  // Get the URL from query parameters
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    throw error(400, 'No URL provided. Please go back and enter a website URL.');
  }

  try {
    // Step 1: Scrape the website
    console.log(`Starting scan for: ${targetUrl}`);
    const scrapedData = await scrapeWebsite(targetUrl);
    console.log('Scraping complete:', scrapedData);

    // Step 2: Generate compliance report using AI
    console.log('Generating report...');
    const report: ComplianceReport = await generateReport(scrapedData);
    console.log('Report generated successfully');

    // Return the report to the page
    return {
      report,
      success: true,
    };
  } catch (err) {
    console.error('Scan error:', err);

    // Provide a user-friendly error message
    const errorMessage =
      err instanceof Error ? err.message : 'An unknown error occurred during the scan.';

    throw error(500, `Failed to scan website: ${errorMessage}`);
  }
};
