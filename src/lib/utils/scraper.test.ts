import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrapeWebsite } from './scraper';

// Mock fetch globally
global.fetch = vi.fn();

describe('scrapeWebsite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockHtml = `
    <!DOCTYPE html>
    <html>
      <head><title>Test Charity</title></head>
      <body>
        <header>
          <nav>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/cookies">Cookie Policy</a>
            <a href="/safeguarding">Safeguarding</a>
          </nav>
        </header>
        <main>
          <p>Welcome to our charity website!</p>
          <p>We accept donations via Stripe.</p>
          <p>Gift Aid can increase your donation by 25%.</p>
          <form>
            <input type="checkbox" name="newsletter" id="newsletter">
            <label for="newsletter">Subscribe to newsletter</label>
          </form>
        </main>
        <footer>
          <p>&copy; 2024 Test Charity. All rights reserved.</p>
        </footer>
      </body>
    </html>
  `;

  const mockPrivacyPolicy = `
    <html>
      <body>
        <h1>Privacy Policy</h1>
        <p>We are committed to protecting your data.</p>
        <p>You have the right to make a data subject access request (DSAR).</p>
        <p>We use third-party data processors to handle your information.</p>
      </body>
    </html>
  `;

  it('should scrape a website and return ScrapedData', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org');

    expect(result).toHaveProperty('scannedUrl');
    expect(result).toHaveProperty('usesSSL');
    expect(result).toHaveProperty('foundPages');
    expect(result).toHaveProperty('documentContents');
    expect(result).toHaveProperty('foundCopyright');
    expect(result).toHaveProperty('paymentType');
    expect(result).toHaveProperty('pecrCheck');
    expect(result).toHaveProperty('foundGiftAid');
    expect(result).toHaveProperty('privacyPolicyChecks');
  });

  it('should normalize URL by adding https protocol', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('example-charity.org');
    expect(result.scannedUrl).toBe('https://example-charity.org');
  });

  it('should normalize URL by removing trailing slash', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org/');
    expect(result.scannedUrl).toBe('https://example-charity.org');
  });

  it('should detect SSL from https URL', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.usesSSL).toBe(true);
  });

  it('should detect missing SSL from http URL', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('http://example-charity.org');
    expect(result.usesSSL).toBe(false);
    expect(result.scannedUrl).toBe('http://example-charity.org');
  });

  it('should find privacy policy link', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.foundPages.privacy).toBe('https://example-charity.org/privacy-policy');
  });

  it('should find cookie policy link', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.foundPages.cookie).toBe('https://example-charity.org/cookies');
  });

  it('should find safeguarding policy link', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.foundPages.safeguarding).toBe('https://example-charity.org/safeguarding');
  });

  it('should detect copyright notice', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.foundCopyright).toBe(true);
  });

  it('should detect missing copyright', async () => {
    const htmlWithoutCopyright = '<html><body><p>No rights reserved</p></body></html>';
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => htmlWithoutCopyright
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.foundCopyright).toBe(false);
  });

  it('should detect third-party payment processor (Stripe)', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.paymentType).toBe('third-party');
  });

  it('should detect third-party payment processor (PayPal)', async () => {
    const htmlWithPayPal = '<html><body><p>We use PayPal for payments</p></body></html>';
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => htmlWithPayPal
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.paymentType).toBe('third-party');
  });

  it('should detect self-hosted payment forms', async () => {
    const htmlWithPaymentForm = `
      <html><body>
        <form>
          <input type="text" name="card-number" placeholder="Card Number">
          <input type="text" name="cvv" placeholder="CVV">
        </form>
      </body></html>
    `;
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => htmlWithPaymentForm
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.paymentType).toBe('self-hosted');
  });

  it('should detect no payment processing', async () => {
    const htmlWithoutPayment = '<html><body><p>Just information here</p></body></html>';
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => htmlWithoutPayment
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.paymentType).toBe('none');
  });

  it('should detect Gift Aid mention', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.foundGiftAid).toBe(true);
  });

  it('should detect missing Gift Aid', async () => {
    const htmlWithoutGiftAid = '<html><body><p>No donations mentioned here</p></body></html>';
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => htmlWithoutGiftAid
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.foundGiftAid).toBe(false);
  });

  it('should detect opt-in newsletter form', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => mockHtml
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.pecrCheck).toBe('opt-in');
  });

  it('should detect opt-out newsletter form', async () => {
    const htmlWithOptOut = `
      <html><body>
        <form>
          <input type="checkbox" checked newsletter>
          <label>Subscribe to newsletter</label>
        </form>
      </body></html>
    `;
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => htmlWithOptOut
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.pecrCheck).toBe('opt-out');
  });

  it('should return unknown PECR status when no newsletter form', async () => {
    const htmlWithoutNewsletter = '<html><body><p>No marketing mentioned</p></body></html>';
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => htmlWithoutNewsletter
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.pecrCheck).toBe('unknown');
  });

  it('should fetch and analyze privacy policy content', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => mockHtml
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => mockPrivacyPolicy
      });

    const result = await scrapeWebsite('https://example-charity.org');

    expect(result.documentContents.privacy).toBeTruthy();
    expect(result.privacyPolicyChecks.mentionsDSAR).toBe(true);
    expect(result.privacyPolicyChecks.mentionsDataProcessors).toBe(true);
  });

  it('should handle privacy policy fetch failure gracefully', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => mockHtml
      })
      .mockRejectedValueOnce(new Error('Network error'));

    const result = await scrapeWebsite('https://example-charity.org');

    expect(result.foundPages.privacy).toBeTruthy();
    expect(result.documentContents.privacy).toBeNull();
  });

  it('should convert relative links to absolute URLs', async () => {
    const htmlWithRelativeLinks = `
      <html><body>
        <a href="/privacy">Privacy</a>
        <a href="/cookies">Cookies</a>
      </body></html>
    `;
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => htmlWithRelativeLinks
    });

    const result = await scrapeWebsite('https://example-charity.org');

    expect(result.foundPages.privacy).toBe('https://example-charity.org/privacy');
    expect(result.foundPages.cookie).toBe('https://example-charity.org/cookies');
  });

  it('should skip anchor and javascript links', async () => {
    const htmlWithSpecialLinks = `
      <html><body>
        <a href="#section">Section</a>
        <a href="javascript:void(0)">Click</a>
        <a href="mailto:test@example.com">Email</a>
        <a href="/privacy-policy">Privacy</a>
      </body></html>
    `;
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: async () => htmlWithSpecialLinks
    });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.foundPages.privacy).toBe('https://example-charity.org/privacy-policy');
  });

  it('should throw error on failed fetch', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    await expect(scrapeWebsite('https://example-charity.org')).rejects.toThrow();
  });

  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    await expect(scrapeWebsite('https://example-charity.org')).rejects.toThrow(
      'Failed to scrape website'
    );
  });

  it('should try common privacy policy URLs if not found in links', async () => {
    const htmlWithoutLinks = '<html><body><p>No links here</p></body></html>';

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWithoutLinks
      })
      .mockResolvedValueOnce({
        ok: true
      });

    const result = await scrapeWebsite('https://example-charity.org');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/privacy'),
      expect.any(Object)
    );
  });

  it('should detect DSAR mentions in privacy policy', async () => {
    const htmlWithPrivacy = '<html><body><a href="/privacy-policy">Privacy</a></body></html>';
    const privacyWithDSAR = 'You can request a copy of your data at any time.';

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWithPrivacy
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => privacyWithDSAR
      });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.privacyPolicyChecks.mentionsDSAR).toBe(true);
  });

  it('should detect missing DSAR in privacy policy', async () => {
    const htmlWithPrivacy = '<html><body><a href="/privacy-policy">Privacy</a></body></html>';
    const privacyWithoutDSAR = '<html><body><p>Basic privacy information</p></body></html>';

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWithPrivacy
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => privacyWithoutDSAR
      });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.privacyPolicyChecks.mentionsDSAR).toBe(false);
  });

  it('should detect data processors in privacy policy', async () => {
    const htmlWithPrivacy = '<html><body><a href="/privacy-policy">Privacy</a></body></html>';
    const privacyWithProcessors = 'We work with third-party service providers to manage your data.';

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => htmlWithPrivacy
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => privacyWithProcessors
      });

    const result = await scrapeWebsite('https://example-charity.org');
    expect(result.privacyPolicyChecks.mentionsDataProcessors).toBe(true);
  });
});
