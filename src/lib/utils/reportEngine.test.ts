import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateReport } from './reportEngine';
import type { ScrapedData } from './types';

// Mock the Gemini API
vi.mock('$env/static/private', () => ({
  GEMINI_API_KEY: ''
}));

describe('generateReport', () => {
  let mockScrapedData: ScrapedData;

  beforeEach(() => {
    mockScrapedData = {
      scannedUrl: 'https://example-charity.org',
      usesSSL: true,
      foundPages: {
        privacy: 'https://example-charity.org/privacy',
        cookie: 'https://example-charity.org/cookies',
        safeguarding: 'https://example-charity.org/safeguarding'
      },
      documentContents: {
        privacy: 'Sample privacy policy content mentioning DSAR and data processors',
        cookie: 'Sample cookie policy',
        safeguarding: 'Sample safeguarding policy'
      },
      foundCopyright: true,
      paymentType: 'third-party',
      pecrCheck: 'opt-in',
      foundGiftAid: true,
      privacyPolicyChecks: {
        mentionsDSAR: true,
        mentionsDataProcessors: true
      }
    };
  });

  it('should generate a compliance report with all fields', async () => {
    const report = await generateReport(mockScrapedData);

    expect(report).toHaveProperty('scannedUrl');
    expect(report).toHaveProperty('scanDate');
    expect(report).toHaveProperty('overallScore');
    expect(report).toHaveProperty('overallStatus');
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('checks');
  });

  it('should return correct scannedUrl', async () => {
    const report = await generateReport(mockScrapedData);
    expect(report.scannedUrl).toBe('https://example-charity.org');
  });

  it('should have a valid scanDate', async () => {
    const report = await generateReport(mockScrapedData);
    expect(report.scanDate).toBeTruthy();
    expect(() => new Date(report.scanDate)).not.toThrow();
  });

  it('should calculate high score for fully compliant site', async () => {
    const report = await generateReport(mockScrapedData);
    expect(report.overallScore).toBeGreaterThan(80);
    expect(report.overallStatus).toBe('Compliant');
  });

  it('should detect SSL compliance', async () => {
    const report = await generateReport(mockScrapedData);
    const sslCheck = report.checks.security.find(c => c.id === 'ssl');

    expect(sslCheck).toBeDefined();
    expect(sslCheck?.status).toBe('Compliant');
    expect(sslCheck?.title).toBe('SSL Certificate (HTTPS)');
  });

  it('should flag missing SSL as non-compliant', async () => {
    mockScrapedData.usesSSL = false;
    const report = await generateReport(mockScrapedData);
    const sslCheck = report.checks.security.find(c => c.id === 'ssl');

    expect(sslCheck?.status).toBe('Non-Compliant');
    expect(report.summary.threats).toContain('Site is not secure (no HTTPS).');
  });

  it('should detect privacy policy presence', async () => {
    const report = await generateReport(mockScrapedData);
    const privacyCheck = report.checks.websitePolicies.find(c => c.id === 'privacy_policy');

    expect(privacyCheck).toBeDefined();
    expect(privacyCheck?.status).toBe('Compliant');
    expect(privacyCheck?.summary).toContain(mockScrapedData.foundPages.privacy);
  });

  it('should flag missing privacy policy', async () => {
    mockScrapedData.foundPages.privacy = null;
    mockScrapedData.documentContents.privacy = null;
    const report = await generateReport(mockScrapedData);
    const privacyCheck = report.checks.websitePolicies.find(c => c.id === 'privacy_policy');

    expect(privacyCheck?.status).toBe('Non-Compliant');
    expect(report.summary.threats).toContain('No Privacy Policy page found.');
  });

  it('should detect cookie policy presence', async () => {
    const report = await generateReport(mockScrapedData);
    const cookieCheck = report.checks.websitePolicies.find(c => c.id === 'cookie_policy');

    expect(cookieCheck).toBeDefined();
    expect(cookieCheck?.status).toBe('Compliant');
  });

  it('should warn about missing cookie policy', async () => {
    mockScrapedData.foundPages.cookie = null;
    const report = await generateReport(mockScrapedData);
    const cookieCheck = report.checks.websitePolicies.find(c => c.id === 'cookie_policy');

    expect(cookieCheck?.status).toBe('Warning');
    expect(report.summary.warnings).toContain('No dedicated Cookie Policy page.');
  });

  it('should detect safeguarding policy', async () => {
    const report = await generateReport(mockScrapedData);
    const safeguardingCheck = report.checks.websitePolicies.find(c => c.id === 'safeguarding_policy');

    expect(safeguardingCheck).toBeDefined();
    expect(safeguardingCheck?.status).toBe('Compliant');
  });

  it('should detect DSAR mentions in privacy policy', async () => {
    const report = await generateReport(mockScrapedData);
    const dsarCheck = report.checks.websitePolicies.find(c => c.id === 'dsar');

    expect(dsarCheck?.status).toBe('Compliant');
  });

  it('should warn about missing DSAR in privacy policy', async () => {
    mockScrapedData.privacyPolicyChecks.mentionsDSAR = false;
    const report = await generateReport(mockScrapedData);
    const dsarCheck = report.checks.websitePolicies.find(c => c.id === 'dsar');

    expect(dsarCheck?.status).toBe('Warning');
    expect(report.summary.warnings).toContain('Privacy Policy missing DSAR info.');
  });

  it('should detect data processors disclosure', async () => {
    const report = await generateReport(mockScrapedData);
    const processorsCheck = report.checks.websitePolicies.find(c => c.id === 'data_processors');

    expect(processorsCheck?.status).toBe('Compliant');
  });

  it('should detect opt-in PECR compliance', async () => {
    const report = await generateReport(mockScrapedData);
    const pecrCheck = report.checks.marketing.find(c => c.id === 'pecr_opt_in');

    expect(pecrCheck?.status).toBe('Compliant');
    expect(report.summary.goodPoints).toContain('PECR-compliant email marketing.');
  });

  it('should flag opt-out as non-compliant', async () => {
    mockScrapedData.pecrCheck = 'opt-out';
    const report = await generateReport(mockScrapedData);
    const pecrCheck = report.checks.marketing.find(c => c.id === 'pecr_opt_in');

    expect(pecrCheck?.status).toBe('Non-Compliant');
    expect(report.summary.threats).toContain('Email marketing form is not opt-in.');
  });

  it('should detect third-party payment processing', async () => {
    const report = await generateReport(mockScrapedData);
    const paymentCheck = report.checks.payments.find(c => c.id === 'pci_dss');

    expect(paymentCheck?.status).toBe('Compliant');
    expect(report.summary.goodPoints).toContain('Uses secure 3rd-party payments.');
  });

  it('should flag self-hosted payment processing', async () => {
    mockScrapedData.paymentType = 'self-hosted';
    const report = await generateReport(mockScrapedData);
    const paymentCheck = report.checks.payments.find(c => c.id === 'pci_dss');

    expect(paymentCheck?.status).toBe('Non-Compliant');
    expect(report.summary.threats).toContain('Self-hosted payment processing detected.');
  });

  it('should detect Gift Aid', async () => {
    const report = await generateReport(mockScrapedData);
    const giftAidCheck = report.checks.payments.find(c => c.id === 'gift_aid');

    expect(giftAidCheck).toBeDefined();
    expect(report.summary.goodPoints).toContain('Promotes Gift Aid.');
  });

  it('should detect copyright notice', async () => {
    const report = await generateReport(mockScrapedData);
    const copyrightCheck = report.checks.memberData.find(c => c.id === 'copyright');

    expect(copyrightCheck?.status).toBe('Compliant');
    expect(report.summary.goodPoints).toContain('Has a copyright notice.');
  });

  it('should warn about missing copyright', async () => {
    mockScrapedData.foundCopyright = false;
    const report = await generateReport(mockScrapedData);
    const copyrightCheck = report.checks.memberData.find(c => c.id === 'copyright');

    expect(copyrightCheck?.status).toBe('Warning');
    expect(report.summary.warnings).toContain('No copyright notice.');
  });

  it('should have summary with good points, warnings, and threats', async () => {
    const report = await generateReport(mockScrapedData);

    expect(report.summary.goodPoints).toBeInstanceOf(Array);
    expect(report.summary.warnings).toBeInstanceOf(Array);
    expect(report.summary.threats).toBeInstanceOf(Array);
  });

  it('should have checks for all categories', async () => {
    const report = await generateReport(mockScrapedData);

    expect(report.checks.websitePolicies).toBeInstanceOf(Array);
    expect(report.checks.security).toBeInstanceOf(Array);
    expect(report.checks.memberData).toBeInstanceOf(Array);
    expect(report.checks.marketing).toBeInstanceOf(Array);
    expect(report.checks.payments).toBeInstanceOf(Array);
  });

  it('should calculate lower score for non-compliant site', async () => {
    mockScrapedData.usesSSL = false;
    mockScrapedData.foundPages.privacy = null;
    mockScrapedData.documentContents.privacy = null;
    mockScrapedData.foundPages.cookie = null;
    mockScrapedData.paymentType = 'self-hosted';
    mockScrapedData.pecrCheck = 'opt-out';
    mockScrapedData.foundCopyright = false;

    const report = await generateReport(mockScrapedData);
    expect(report.overallScore).toBeLessThan(50);
    expect(report.overallStatus).toBe('Non-Compliant');
  });

  it('should cap score at 100', async () => {
    const report = await generateReport(mockScrapedData);
    expect(report.overallScore).toBeLessThanOrEqual(100);
  });

  it('should have minimum score of 0', async () => {
    mockScrapedData.usesSSL = false;
    mockScrapedData.foundPages.privacy = null;
    mockScrapedData.documentContents.privacy = null;
    mockScrapedData.foundPages.cookie = null;
    mockScrapedData.foundPages.safeguarding = null;
    mockScrapedData.paymentType = 'self-hosted';
    mockScrapedData.pecrCheck = 'opt-out';
    mockScrapedData.foundCopyright = false;
    mockScrapedData.foundGiftAid = false;

    const report = await generateReport(mockScrapedData);
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
  });
});
