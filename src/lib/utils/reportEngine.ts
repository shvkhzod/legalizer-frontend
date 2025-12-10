// /src/lib/utils/reportEngine.ts
import type { ScrapedData, ComplianceReport, ComplianceCheck, ComplianceStatus } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

/**
 * Generate a compliance report from scraped data using AI analysis
 * @param data - The scraped website data
 * @returns Complete compliance report
 */
export async function generateReport(data: ScrapedData): Promise<ComplianceReport> {
  // Initialize report structure
  let score = 0;
  const checks: ComplianceReport['checks'] = {
    websitePolicies: [],
    security: [],
    memberData: [],
    marketing: [],
    payments: [],
  };
  const summary = {
    goodPoints: [] as string[],
    warnings: [] as string[],
    threats: [] as string[],
  };

  // --- 1. Security Checks ---
  if (data.usesSSL) {
    checks.security.push({
      id: 'ssl',
      title: 'SSL Certificate (HTTPS)',
      status: 'Compliant',
      summary: 'Site is served over HTTPS with a valid certificate.',
      recommendation: 'No action needed. Keep your certificate renewed.',
    });
    summary.goodPoints.push('Website is secure (HTTPS).');
    score += 20;
  } else {
    checks.security.push({
      id: 'ssl',
      title: 'SSL Certificate (HTTPS)',
      status: 'Non-Compliant',
      summary: 'Site is not served over HTTPS.',
      recommendation:
        "This is a high risk. All sites must use HTTPS. Install a free Let's Encrypt certificate.",
    });
    summary.threats.push('Site is not secure (no HTTPS).');
  }

  // --- 2. Website Policies ---
  if (data.foundPages.privacy) {
    checks.websitePolicies.push({
      id: 'privacy_policy',
      title: 'Privacy Policy',
      status: 'Compliant',
      summary: `A Privacy Policy page was found at ${data.foundPages.privacy}.`,
      recommendation: 'Good. Ensure it is linked in your website footer.',
    });
    summary.goodPoints.push('Has a Privacy Policy.');
    score += 15;
  } else {
    checks.websitePolicies.push({
      id: 'privacy_policy',
      title: 'Privacy Policy',
      status: 'Non-Compliant',
      summary: 'A "Privacy Policy" page could not be found.',
      recommendation:
        'This is a major GDPR risk. You must create and display a Privacy Policy immediately.',
    });
    summary.threats.push('No Privacy Policy page found.');
  }

  if (data.foundPages.cookie) {
    checks.websitePolicies.push({
      id: 'cookie_policy',
      title: 'Cookie Policy',
      status: 'Compliant',
      summary: `A Cookie Policy page was found at ${data.foundPages.cookie}.`,
      recommendation: 'Good. Ensure it is clear and up-to-date.',
    });
    summary.goodPoints.push('Has a Cookie Policy.');
    score += 5;
  } else {
    checks.websitePolicies.push({
      id: 'cookie_policy',
      title: 'Cookie Policy',
      status: 'Warning',
      summary: 'A dedicated "Cookie Policy" page could not be found.',
      recommendation:
        'This is recommended. You can also include cookie information in your Privacy Policy.',
    });
    summary.warnings.push('No dedicated Cookie Policy page.');
  }

  if (data.foundPages.safeguarding) {
    checks.websitePolicies.push({
      id: 'safeguarding_policy',
      title: 'Safeguarding Policy',
      status: 'Compliant',
      summary: `A Safeguarding Policy page was found at ${data.foundPages.safeguarding}.`,
      recommendation: 'Good. Ensure it is easily accessible and up-to-date.',
    });
    summary.goodPoints.push('Has a Safeguarding Policy.');
    score += 10;
  } else {
    checks.websitePolicies.push({
      id: 'safeguarding_policy',
      title: 'Safeguarding Policy',
      status: 'Warning',
      summary: 'A "Safeguarding Policy" page could not be found.',
      recommendation:
        'If your charity works with children or vulnerable adults, this is essential.',
    });
    summary.warnings.push('No Safeguarding Policy page found.');
  }

  // --- 3. Privacy Policy Content Checks ---
  if (data.foundPages.privacy) {
    if (data.privacyPolicyChecks.mentionsDSAR) {
      checks.websitePolicies.push({
        id: 'dsar',
        title: 'DSAR Process (in Privacy Policy)',
        status: 'Compliant',
        summary: 'Your Privacy Policy mentions DSARs or Subject Access Requests.',
        recommendation: 'Good. Ensure the process is clear and easy to follow.',
      });
      summary.goodPoints.push('Privacy Policy mentions DSARs.');
      score += 10;
    } else {
      checks.websitePolicies.push({
        id: 'dsar',
        title: 'DSAR Process (in Privacy Policy)',
        status: 'Warning',
        summary: 'Your Privacy Policy does not seem to mention "DSAR" or "Subject Access Request".',
        recommendation: 'You must update your policy to explain how a user can request a copy of their data.',
      });
      summary.warnings.push('Privacy Policy missing DSAR info.');
    }

    if (data.privacyPolicyChecks.mentionsDataProcessors) {
      checks.websitePolicies.push({
        id: 'data_processors',
        title: 'Data Processors Disclosure',
        status: 'Compliant',
        summary: 'Your Privacy Policy mentions data processors or third-party services.',
        recommendation: 'Good. Ensure the list is complete and current.',
      });
      summary.goodPoints.push('Privacy Policy mentions data processors.');
      score += 5;
    } else {
      checks.websitePolicies.push({
        id: 'data_processors',
        title: 'Data Processors Disclosure',
        status: 'Warning',
        summary: 'Your Privacy Policy does not clearly mention data processors or third-party services.',
        recommendation: 'GDPR requires you to disclose any third parties that process user data.',
      });
      summary.warnings.push('Privacy Policy missing data processor info.');
    }
  }

  // --- 4. Marketing (PECR) ---
  if (data.pecrCheck === 'opt-in') {
    checks.marketing.push({
      id: 'pecr_opt_in',
      title: 'Email Marketing (PECR)',
      status: 'Compliant',
      summary: 'Newsletter signup form appears to be "opt-in".',
      recommendation: 'This is correct. Do not use pre-ticked boxes.',
    });
    summary.goodPoints.push('PECR-compliant email marketing.');
    score += 10;
  } else if (data.pecrCheck === 'opt-out') {
    checks.marketing.push({
      id: 'pecr_opt_in',
      title: 'Email Marketing (PECR)',
      status: 'Non-Compliant',
      summary: 'Newsletter signup form appears to be "opt-out" (pre-ticked).',
      recommendation: 'This is not compliant with PECR/GDPR. All marketing consent must be explicit and opt-in (unchecked).',
    });
    summary.threats.push('Email marketing form is not opt-in.');
  } else {
    checks.marketing.push({
      id: 'pecr_opt_in',
      title: 'Email Marketing (PECR)',
      status: 'Info',
      summary: 'Could not determine email marketing consent type.',
      recommendation: 'Ensure any email signup forms use an unchecked, opt-in box.',
    });
  }

  // --- 5. Payments (PCI DSS) ---
  if (data.paymentType === 'third-party') {
    checks.payments.push({
      id: 'pci_dss',
      title: 'e-Payments (PCI DSS)',
      status: 'Compliant',
      summary: 'Site uses a third-party payment processor (e.g., Stripe, PayPal).',
      recommendation:
        'This is the best practice as it offloads PCI DSS compliance to the payment provider.',
    });
    summary.goodPoints.push('Uses secure 3rd-party payments.');
    score += 10;
  } else if (data.paymentType === 'self-hosted') {
    checks.payments.push({
      id: 'pci_dss',
      title: 'e-Payments (PCI DSS)',
      status: 'Non-Compliant',
      summary: 'Site appears to process payments directly (self-hosted).',
      recommendation:
        'This is extremely high-risk. You must comply with PCI DSS Level 1 standards or switch to a third-party processor immediately.',
    });
    summary.threats.push('Self-hosted payment processing detected.');
  } else {
    checks.payments.push({
      id: 'pci_dss',
      title: 'e-Payments (PCI DSS)',
      status: 'Info',
      summary: 'No payment processing detected.',
      recommendation: 'If you accept donations online, ensure you use a secure third-party processor.',
    });
  }

  // Gift Aid check
  if (data.foundGiftAid) {
    checks.payments.push({
      id: 'gift_aid',
      title: 'Gift Aid',
      status: 'Info',
      summary: 'Website mentions Gift Aid.',
      recommendation: 'Good. Ensure your Gift Aid process complies with HMRC requirements and GDPR.',
    });
    summary.goodPoints.push('Promotes Gift Aid.');
    score += 5;
  } else {
    checks.payments.push({
      id: 'gift_aid',
      title: 'Gift Aid',
      status: 'Info',
      summary: 'No mention of Gift Aid found.',
      recommendation: 'Consider promoting Gift Aid to increase donation value by 25%.',
    });
  }

  // --- 6. Member Data (Copyright) ---
  if (data.foundCopyright) {
    checks.memberData.push({
      id: 'copyright',
      title: 'Copyright Notice',
      status: 'Compliant',
      summary: 'Website includes a copyright notice.',
      recommendation: 'Good. Ensure the year is current.',
    });
    summary.goodPoints.push('Has a copyright notice.');
    score += 5;
  } else {
    checks.memberData.push({
      id: 'copyright',
      title: 'Copyright Notice',
      status: 'Warning',
      summary: 'No copyright notice found.',
      recommendation: 'Consider adding a copyright notice in your footer (e.g., "© 2025 Your Charity").',
    });
    summary.warnings.push('No copyright notice.');
  }

  // --- Use AI to enhance the report with insights ---
  const enhancedReport = await enhanceReportWithAI(data, {
    scannedUrl: data.scannedUrl,
    scanDate: new Date().toISOString(),
    overallScore: Math.max(0, Math.min(100, score)),
    overallStatus: calculateOverallStatus(Math.max(0, Math.min(100, score))),
    summary,
    checks,
  });

  return enhancedReport;
}

/**
 * Calculate overall status based on score
 */
function calculateOverallStatus(score: number): ComplianceStatus {
  if (score > 85) return 'Compliant';
  if (score > 60) return 'Warning';
  return 'Non-Compliant';
}

/**
 * Use Google Gemini to perform deep document analysis and enhance the report
 */
async function enhanceReportWithAI(
  scrapedData: ScrapedData,
  preliminaryReport: ComplianceReport
): Promise<ComplianceReport> {
  // Check for API key
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set. Skipping AI enhancement.');
    return preliminaryReport;
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Build comprehensive prompt with document contents
    let documentSection = '';
    if (scrapedData.documentContents.privacy) {
      documentSection += `\n\n=== PRIVACY POLICY FULL TEXT ===\n${scrapedData.documentContents.privacy}\n`;
    }
    if (scrapedData.documentContents.cookie) {
      documentSection += `\n\n=== COOKIE POLICY FULL TEXT ===\n${scrapedData.documentContents.cookie}\n`;
    }
    if (scrapedData.documentContents.safeguarding) {
      documentSection += `\n\n=== SAFEGUARDING POLICY FULL TEXT ===\n${scrapedData.documentContents.safeguarding}\n`;
    }

    const prompt = `You are an expert legal compliance auditor specializing in charity and non-profit regulations, GDPR, PECR, and UK charity law.

TASK: Perform a detailed compliance audit of this charity's website and legal documents. Analyze the actual document content carefully and identify specific compliance issues, missing clauses, and improvements needed.

SCANNED WEBSITE: ${scrapedData.scannedUrl}

WEBSITE ANALYSIS:
- SSL/HTTPS: ${scrapedData.usesSSL ? 'Yes' : 'No'}
- Privacy Policy URL: ${scrapedData.foundPages.privacy || 'Not found'}
- Cookie Policy URL: ${scrapedData.foundPages.cookie || 'Not found'}
- Safeguarding Policy URL: ${scrapedData.foundPages.safeguarding || 'Not found'}
- Payment Processing: ${scrapedData.paymentType}
- Email Marketing: ${scrapedData.pecrCheck}
- Gift Aid mentioned: ${scrapedData.foundGiftAid ? 'Yes' : 'No'}
${documentSection}

PRELIMINARY AUTOMATED CHECKS:
${JSON.stringify(preliminaryReport, null, 2)}

YOUR TASK:
1. **Carefully read and analyze each policy document** provided above
2. **Identify specific compliance violations** - cite the exact problematic sections or missing clauses
3. **Check for GDPR requirements**:
   - Data controller contact details
   - Legal basis for processing
   - Data retention periods
   - Third-party data processors listed
   - Data subject rights (DSAR, rectification, erasure, portability)
   - International data transfers
   - Complaint procedures (ICO contact)
4. **Check for PECR requirements** (if applicable):
   - Cookie consent mechanism
   - Analytics disclosure
   - Marketing consent (opt-in)
5. **Check charity-specific requirements**:
   - Safeguarding policies (if working with vulnerable groups)
   - Fundraising standards
   - Financial transparency
6. **Provide actionable recommendations** with specific text suggestions where possible

OUTPUT FORMAT:
Return a JSON object with the EXACT same structure as the preliminary report, but with:
- Enhanced, detailed summaries citing specific issues found in the documents
- Specific, actionable recommendations with examples
- Updated summary.goodPoints, summary.warnings, and summary.threats based on your detailed analysis
- Adjust overallScore based on the severity of issues found (reduce score for serious violations)

IMPORTANT:
- Be thorough and specific - cite actual problems you find in the text
- If a document is missing critical sections (e.g., no data retention period), explicitly state this
- Prioritize serious legal violations over minor issues
- Provide clear, actionable guidance that a charity can implement immediately

Return ONLY the JSON object, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // Try to parse as JSON
    const enhancedReport = JSON.parse(jsonText) as ComplianceReport;

    // Validate the enhanced report has the required structure
    if (!enhancedReport.checks || !enhancedReport.summary) {
      console.warn('AI returned invalid report structure, using preliminary report');
      return preliminaryReport;
    }

    return enhancedReport;
  } catch (error) {
    console.error('AI enhancement error:', error);
    // Fall back to preliminary report if AI enhancement fails
    return preliminaryReport;
  }
}
