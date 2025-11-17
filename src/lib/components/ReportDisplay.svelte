<script lang="ts">
  import { onMount } from 'svelte';
  import type { ComplianceReport } from '$lib/utils/types';
  import ReportCard from './ReportCard.svelte';

  export let report: ComplianceReport;

  let displayScore = 0;
  let animationStarted = false;

  onMount(() => {
    // Start the animation after the scale-in completes
    setTimeout(() => {
      animateScore();
    }, 1000); // Start after circle scale-in (0.8s) + small delay
  });

  function animateScore() {
    if (animationStarted) return;
    animationStarted = true;

    const targetScore = report.overallScore;
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startScore = 0;

    function updateScore() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      displayScore = Math.round(startScore + (targetScore - startScore) * easeOutCubic);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      } else {
        displayScore = targetScore;
      }
    }

    requestAnimationFrame(updateScore);
  }

  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getOverallStatusColor(status: string): string {
    switch (status) {
      case 'Compliant':
        return 'var(--status-good)';
      case 'Warning':
        return 'var(--status-warning)';
      case 'Non-Compliant':
        return 'var(--status-threat)';
      default:
        return 'var(--color-text-secondary)';
    }
  }

  function getScoreColor(score: number): string {
    if (score > 85) return 'var(--status-good)';
    if (score > 60) return 'var(--status-warning)';
    return 'var(--status-threat)';
  }
</script>

<div class="report-display">
  <!-- Overall Summary -->
  <div class="report-header">
    <div class="header-content">
      <h1>Compliance Report</h1>
      <p class="scan-info">
        <strong>Scanned URL:</strong> <a href={report.scannedUrl} target="_blank" rel="noopener noreferrer">{report.scannedUrl}</a>
      </p>
      <p class="scan-info">
        <strong>Scan Date:</strong> {formatDate(report.scanDate)}
      </p>
    </div>

    <div class="score-container">
      <div class="score-circle" style="border-color: {getScoreColor(report.overallScore)};">
        <span class="score-number">{displayScore}</span>
        <span class="score-label">/ 100</span>
      </div>
      <div class="overall-status" style="color: {getOverallStatusColor(report.overallStatus)};">
        {report.overallStatus}
      </div>
    </div>
  </div>

  <!-- Summary Section -->
  {#if report.summary.goodPoints.length > 0 || report.summary.warnings.length > 0 || report.summary.threats.length > 0}
    <div class="summary-section">
      <h2>Executive Summary</h2>

      {#if report.summary.goodPoints.length > 0}
        <div class="summary-box good">
          <h3>✓ Strengths</h3>
          <ul>
            {#each report.summary.goodPoints as point}
              <li>{point}</li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if report.summary.warnings.length > 0}
        <div class="summary-box warning">
          <h3>⚠ Warnings</h3>
          <ul>
            {#each report.summary.warnings as warning}
              <li>{warning}</li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if report.summary.threats.length > 0}
        <div class="summary-box threat">
          <h3>✗ Critical Issues</h3>
          <ul>
            {#each report.summary.threats as threat}
              <li>{threat}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Detailed Checks -->
  <div class="checks-section">
    <h2>Detailed Findings</h2>

    {#if report.checks.security.length > 0}
      <div class="check-category">
        <h3>Security</h3>
        {#each report.checks.security as check}
          <ReportCard {check} />
        {/each}
      </div>
    {/if}

    {#if report.checks.websitePolicies.length > 0}
      <div class="check-category">
        <h3>Website Policies</h3>
        {#each report.checks.websitePolicies as check}
          <ReportCard {check} />
        {/each}
      </div>
    {/if}

    {#if report.checks.marketing.length > 0}
      <div class="check-category">
        <h3>Marketing Compliance</h3>
        {#each report.checks.marketing as check}
          <ReportCard {check} />
        {/each}
      </div>
    {/if}

    {#if report.checks.payments.length > 0}
      <div class="check-category">
        <h3>Payment Processing</h3>
        {#each report.checks.payments as check}
          <ReportCard {check} />
        {/each}
      </div>
    {/if}

    {#if report.checks.memberData.length > 0}
      <div class="check-category">
        <h3>Member Data & Copyright</h3>
        {#each report.checks.memberData as check}
          <ReportCard {check} />
        {/each}
      </div>
    {/if}
  </div>

  <!-- Action Buttons -->
  <div class="action-buttons">
    <a href="/" class="button">Scan Another Website</a>
  </div>
</div>

<style>
  .report-display {
    max-width: 900px;
    margin: 0 auto;
  }

  .report-header {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    backdrop-filter: blur(10px);
    animation: slideInDown 0.6s ease-out;
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header-content {
    flex: 1;
  }

  .report-header h1 {
    font-family: 'Inter', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 12px;
  }

  .scan-info {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #9ca3af;
    margin-bottom: 8px;
  }

  .scan-info strong {
    color: #ffffff;
    font-weight: 500;
  }

  .scan-info a {
    color: #228bff;
    text-decoration: none;
    word-break: break-all;
  }

  .scan-info a:hover {
    opacity: 0.8;
  }

  .score-container {
    text-align: center;
  }

  .score-circle {
    width: 120px;
    height: 120px;
    border: 6px solid;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    animation: scaleIn 0.8s ease-out 0.2s both;
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .score-number {
    font-family: 'Inter', sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .score-label {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #9ca3af;
  }

  .overall-status {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
  }

  .summary-section {
    margin-bottom: 48px;
    animation: fadeIn 0.6s ease-out 0.3s both;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .summary-section h2 {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 24px;
  }

  .summary-box {
    border-left: 4px solid;
    padding: 24px;
    margin-bottom: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    animation: slideInLeft 0.5s ease-out both;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .summary-box:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .summary-box:nth-child(2) {
    animation-delay: 0.1s;
  }

  .summary-box:nth-child(3) {
    animation-delay: 0.2s;
  }

  .summary-box:nth-child(4) {
    animation-delay: 0.3s;
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .summary-box.good {
    border-color: #34c759;
    background: rgba(52, 199, 89, 0.1);
  }

  .summary-box.warning {
    border-color: #ff9f0a;
    background: rgba(255, 159, 10, 0.1);
  }

  .summary-box.threat {
    border-color: #ff3b30;
    background: rgba(255, 59, 48, 0.1);
  }

  .summary-box h3 {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    margin-top: 0;
    margin-bottom: 12px;
  }

  .summary-box ul {
    margin: 0;
    padding-left: 24px;
  }

  .summary-box li {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #e5e7eb;
    margin-bottom: 8px;
  }

  .checks-section {
    margin-bottom: 48px;
    animation: fadeIn 0.6s ease-out 0.5s both;
  }

  .checks-section > h2 {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 32px;
  }

  .check-category {
    margin-bottom: 48px;
  }

  .check-category > h3 {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.08);
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 48px;
    padding-top: 48px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .action-buttons .button {
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .action-buttons .button:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }

  /* Tablet Responsive */
  @media (max-width: 1024px) {
    .report-display {
      max-width: 100%;
    }

    .report-header {
      padding: 28px;
      gap: 20px;
    }

    .report-header h1 {
      font-size: 26px;
    }

    .scan-info {
      font-size: 13px;
    }

    .summary-section h2, .checks-section > h2 {
      font-size: 22px;
    }

    .check-category > h3 {
      font-size: 18px;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .report-display {
      max-width: 100%;
    }

    .report-header {
      flex-direction: column;
      text-align: center;
      padding: 24px;
      border-radius: 20px;
      margin-bottom: 24px;
      gap: 16px;
    }

    .header-content {
      width: 100%;
    }

    .report-header h1 {
      font-size: 24px;
      margin-bottom: 16px;
    }

    .scan-info {
      font-size: 13px;
      margin-bottom: 6px;
    }

    .scan-info a {
      display: block;
      margin-top: 4px;
    }

    .score-container {
      width: 100%;
    }

    .score-circle {
      width: 100px;
      height: 100px;
      border-width: 5px;
      margin: 0 auto 12px;
    }

    .score-number {
      font-size: 2rem;
    }

    .score-label {
      font-size: 13px;
    }

    .overall-status {
      font-size: 16px;
    }

    .summary-section {
      margin-bottom: 32px;
    }

    .summary-section h2 {
      font-size: 20px;
      margin-bottom: 20px;
    }

    .summary-box {
      padding: 20px;
      margin-bottom: 12px;
      border-radius: 10px;
      border-left-width: 3px;
    }

    .summary-box h3 {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .summary-box ul {
      padding-left: 20px;
    }

    .summary-box li {
      font-size: 13px;
      margin-bottom: 6px;
    }

    .checks-section {
      margin-bottom: 32px;
    }

    .checks-section > h2 {
      font-size: 20px;
      margin-bottom: 24px;
    }

    .check-category {
      margin-bottom: 32px;
    }

    .check-category > h3 {
      font-size: 18px;
      margin-bottom: 20px;
      padding-bottom: 10px;
    }

    .action-buttons {
      margin-top: 32px;
      padding-top: 32px;
      flex-direction: column;
    }

    .action-buttons .button {
      width: 100%;
      padding: 11px 20px;
      font-size: 15px;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .report-header {
      padding: 20px;
    }

    .report-header h1 {
      font-size: 22px;
    }

    .scan-info {
      font-size: 12px;
    }

    .score-circle {
      width: 90px;
      height: 90px;
    }

    .score-number {
      font-size: 1.75rem;
    }

    .summary-section h2,
    .checks-section > h2 {
      font-size: 18px;
    }

    .summary-box {
      padding: 16px;
    }

    .summary-box h3 {
      font-size: 15px;
    }

    .summary-box li {
      font-size: 12px;
    }

    .check-category > h3 {
      font-size: 16px;
    }
  }
</style>
