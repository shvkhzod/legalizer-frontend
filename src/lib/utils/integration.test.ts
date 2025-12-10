import { describe, it, expect } from 'vitest';
import { scrapeWebsite } from './scraper';
import { generateReport } from './reportEngine';

describe('Integration Test - Real Website', () => {
  it('should scan humdum.org and generate a compliance report', async () => {
    // This test uses a real website, so it may take longer
    const url = 'https://humdum.org';

    console.log(`\n🔍 Scanning ${url}...`);

    // Step 1: Scrape the website
    const scrapedData = await scrapeWebsite(url);

    console.log('\n📊 Scraped Data:');
    console.log(`  - SSL: ${scrapedData.usesSSL ? '✓' : '✗'}`);
    console.log(`  - Privacy Policy: ${scrapedData.foundPages.privacy || 'Not found'}`);
    console.log(`  - Cookie Policy: ${scrapedData.foundPages.cookie || 'Not found'}`);
    console.log(`  - Safeguarding Policy: ${scrapedData.foundPages.safeguarding || 'Not found'}`);
    console.log(`  - Copyright: ${scrapedData.foundCopyright ? '✓' : '✗'}`);
    console.log(`  - Payment Type: ${scrapedData.paymentType}`);
    console.log(`  - PECR Check: ${scrapedData.pecrCheck}`);
    console.log(`  - Gift Aid: ${scrapedData.foundGiftAid ? '✓' : '✗'}`);
    console.log(`  - Privacy Policy Checks:`);
    console.log(`    - Mentions DSAR: ${scrapedData.privacyPolicyChecks.mentionsDSAR ? '✓' : '✗'}`);
    console.log(`    - Mentions Data Processors: ${scrapedData.privacyPolicyChecks.mentionsDataProcessors ? '✓' : '✗'}`);

    // Verify scraper returned valid data
    expect(scrapedData).toBeDefined();
    expect(scrapedData.scannedUrl).toBe('https://humdum.org');
    expect(typeof scrapedData.usesSSL).toBe('boolean');

    // Step 2: Generate compliance report
    console.log('\n📝 Generating compliance report...');
    const report = await generateReport(scrapedData);

    console.log('\n✅ Compliance Report Generated:');
    console.log(`  - Overall Score: ${report.overallScore}/100`);
    console.log(`  - Overall Status: ${report.overallStatus}`);
    console.log(`  - Scan Date: ${report.scanDate}`);

    console.log('\n✨ Good Points:');
    report.summary.goodPoints.forEach((point, i) => {
      console.log(`  ${i + 1}. ${point}`);
    });

    if (report.summary.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      report.summary.warnings.forEach((warning, i) => {
        console.log(`  ${i + 1}. ${warning}`);
      });
    }

    if (report.summary.threats.length > 0) {
      console.log('\n🚨 Threats:');
      report.summary.threats.forEach((threat, i) => {
        console.log(`  ${i + 1}. ${threat}`);
      });
    }

    console.log('\n📋 Detailed Checks:');

    console.log('\n  Security Checks:');
    report.checks.security.forEach(check => {
      console.log(`    - ${check.title}: ${check.status}`);
    });

    console.log('\n  Website Policies:');
    report.checks.websitePolicies.forEach(check => {
      console.log(`    - ${check.title}: ${check.status}`);
    });

    console.log('\n  Marketing:');
    report.checks.marketing.forEach(check => {
      console.log(`    - ${check.title}: ${check.status}`);
    });

    console.log('\n  Payments:');
    report.checks.payments.forEach(check => {
      console.log(`    - ${check.title}: ${check.status}`);
    });

    console.log('\n  Member Data:');
    report.checks.memberData.forEach(check => {
      console.log(`    - ${check.title}: ${check.status}`);
    });

    // Verify report structure
    expect(report).toBeDefined();
    expect(report.scannedUrl).toBe('https://humdum.org');
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.overallScore).toBeLessThanOrEqual(100);
    expect(['Compliant', 'Warning', 'Non-Compliant']).toContain(report.overallStatus);
    expect(report.checks.security.length).toBeGreaterThan(0);

    console.log('\n✅ Integration test completed successfully!\n');
  }, 60000); // 60 second timeout for real network requests
});
