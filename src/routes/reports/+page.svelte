<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api/client';

  interface ReportSummary {
    id: number;
    scannedUrl: string;
    scanDate: string;
    overallStatus: string;
    overallScore: number;
    createdAt: string;
  }

  let reports: ReportSummary[] = [];
  let loading = true;
  let error = '';
  let animatedScores: { [key: number]: number } = {};

  onMount(async () => {
    // Redirect to login if not authenticated
    if (!$authStore.isAuthenticated || !$authStore.accessToken) {
      goto('/login');
      return;
    }

    try {
      const response = await api.getReports($authStore.accessToken);
      reports = response.reports;

      // Initialize animated scores after reports load
      setTimeout(() => {
        reports.forEach((report, index) => {
          setTimeout(() => {
            animateScore(report.id, report.overallScore);
          }, index * 100);
        });
      }, 300);
    } catch (err: any) {
      error = err.message || 'Failed to load reports';
    } finally {
      loading = false;
    }
  });

  function animateScore(reportId: number, targetScore: number) {
    const duration = 1000;
    const startTime = Date.now();
    animatedScores[reportId] = 0;

    function updateScore() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      animatedScores[reportId] = Math.round(targetScore * easeOutCubic);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      } else {
        animatedScores[reportId] = targetScore;
      }
    }

    requestAnimationFrame(updateScore);
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'Compliant':
        return 'var(--status-good)';
      case 'Warning':
        return 'var(--status-warning)';
      case 'Non-Compliant':
        return 'var(--status-threat)';
      default:
        return 'var(--status-info)';
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function deleteReport(reportId: number) {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await api.deleteReport($authStore.accessToken!, reportId);
      reports = reports.filter(r => r.id !== reportId);
    } catch (err) {
      alert('Failed to delete report');
    }
  }

  function viewReport(reportId: number) {
    goto(`/reports/${reportId}`);
  }
</script>

<svelte:head>
  <title>My Reports - Legal Compliance Checker</title>
</svelte:head>

<!-- Background decorations -->
<div class="bg-grid"></div>
<div class="bg-blur-top"></div>

<main>
  <div class="page-header">
    <h1>My Scan Reports</h1>
    <p>View and manage your compliance scan history</p>
  </div>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading your reports...</p>
    </div>
  {:else if error}
    <div class="error-message">
      {error}
    </div>
  {:else if reports.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📊</div>
      <h2>No Reports Yet</h2>
      <p>You haven't scanned any websites yet. Start your first scan to see reports here.</p>
      <a href="/" class="button button-primary">Start Scanning</a>
    </div>
  {:else}
    <div class="reports-grid">
      {#each reports as report}
        <div class="report-card">
          <div class="report-header">
            <div class="report-url">
              <h3>{report.scannedUrl}</h3>
              <p class="scan-date">{formatDate(report.scanDate)}</p>
            </div>
            <div
              class="status-badge"
              style="background-color: {getStatusColor(report.overallStatus)};"
            >
              {report.overallStatus}
            </div>
          </div>

          <div class="report-score">
            <div class="score-circle">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <path
                  class="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="circle"
                  stroke-dasharray="{animatedScores[report.id] || 0}, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  style="stroke: {getStatusColor(report.overallStatus)};"
                />
                <text x="18" y="20.35" class="percentage">{animatedScores[report.id] || 0}%</text>
              </svg>
            </div>
            <p class="score-label">Overall Score</p>
          </div>

          <div class="report-actions">
            <button class="button" on:click={() => viewReport(report.id)}>
              View Details
            </button>
            <button class="button button-danger" on:click={() => deleteReport(report.id)}>
              Delete
            </button>
          </div>
        </div>
      {/each}
    </div>

    <div class="reports-summary">
      <p>Showing {reports.length} {reports.length === 1 ? 'report' : 'reports'}</p>
    </div>
  {/if}
</main>

<style>
  /* Background decorations */
  .bg-grid {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
    mask-image: radial-gradient(ellipse 800px 600px at center top, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse 800px 600px at center top, black 0%, transparent 70%);
  }

  .bg-blur-top {
    position: absolute;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(34, 139, 255, 0.25) 0%, rgba(34, 139, 255, 0.12) 30%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }

  main {
    position: relative;
    z-index: 1;
    padding: 80px 2rem 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 48px;
    text-align: center;
  }

  .page-header h1 {
    font-family: 'Inter', sans-serif;
    font-size: 48px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 12px;
    animation: slideInDown 0.8s ease-out;
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

  .page-header p {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: #9ca3af;
    margin: 0;
    animation: slideInDown 0.8s ease-out 0.1s both;
  }

  .loading {
    text-align: center;
    padding: 80px 2rem;
  }

  .spinner {
    width: 50px;
    height: 50px;
    margin: 0 auto 24px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: #228bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading p {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #9ca3af;
  }

  .error-message {
    background: rgba(255, 59, 48, 0.1);
    border: 1px solid rgba(255, 59, 48, 0.3);
    color: #ff3b30;
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom: 32px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    text-align: center;
  }

  .empty-state {
    text-align: center;
    padding: 80px 2rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    backdrop-filter: blur(10px);
    animation: scaleIn 0.6s ease-out;
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .empty-icon {
    font-size: 5rem;
    margin-bottom: 24px;
    opacity: 0.5;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .empty-state h2 {
    font-family: 'Inter', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 12px;
  }

  .empty-state p {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #9ca3af;
    margin-bottom: 32px;
  }

  .button-primary {
    padding: 12px 24px;
    background: #228bff;
    border: none;
    border-radius: 12px;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .button-primary:hover {
    opacity: 0.9;
  }

  .reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .report-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 32px;
    backdrop-filter: blur(10px);
    transition: all 0.3s;
    animation: slideInUp 0.6s ease-out both;
    position: relative;
    overflow: hidden;
  }

  .report-card::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 70%
    );
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  .report-card:hover::after {
    transform: translateX(100%);
  }

  .report-card:nth-child(1) { animation-delay: 0.1s; }
  .report-card:nth-child(2) { animation-delay: 0.2s; }
  .report-card:nth-child(3) { animation-delay: 0.3s; }
  .report-card:nth-child(4) { animation-delay: 0.4s; }
  .report-card:nth-child(5) { animation-delay: 0.5s; }
  .report-card:nth-child(6) { animation-delay: 0.6s; }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .report-card:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 30px rgba(34, 139, 255, 0.2);
  }

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    gap: 16px;
  }

  .report-url h3 {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #ffffff;
    word-break: break-word;
  }

  .scan-date {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    animation: fadeIn 0.5s ease-out 0.4s both;
    position: relative;
  }

  .status-badge::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -4px;
    width: 6px;
    height: 6px;
    background: currentColor;
    border-radius: 50%;
    transform: translateY(-50%);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .report-score {
    text-align: center;
    margin-bottom: 24px;
    padding: 24px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .score-circle {
    width: 120px;
    margin: 0 auto 16px;
  }

  .circular-chart {
    display: block;
    max-width: 100%;
    max-height: 250px;
  }

  .circle-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 3.8;
  }

  .circle {
    fill: none;
    stroke-width: 2.8;
    stroke-linecap: round;
    transition: stroke-dasharray 0.6s ease-out;
  }

  .percentage {
    fill: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 0.5em;
    text-anchor: middle;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .score-label {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }

  .report-actions {
    display: flex;
    gap: 12px;
  }

  .report-actions .button {
    flex: 1;
    text-align: center;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    display: inline-block;
    position: relative;
    overflow: hidden;
  }

  .report-actions .button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    transform: translate(-50%, -50%);
    transition: width 0.4s, height 0.4s;
  }

  .report-actions .button:hover::before {
    width: 200px;
    height: 200px;
  }

  .report-actions .button:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .report-actions .button:active {
    transform: translateY(0);
  }

  .button-danger {
    background: transparent;
    color: #ff3b30;
    border: 1px solid rgba(255, 59, 48, 0.3);
  }

  .button-danger:hover {
    background: rgba(255, 59, 48, 0.1);
    border-color: rgba(255, 59, 48, 0.5);
  }

  .reports-summary {
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #9ca3af;
    padding: 24px 0;
  }

  /* Tablet Responsive */
  @media (max-width: 1024px) {
    main {
      padding: 60px 1.5rem 30px;
    }

    .page-header h1 {
      font-size: 40px;
    }

    .reports-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    main {
      padding: 60px 1rem 20px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
    }

    .page-header p {
      font-size: 14px;
    }

    .loading {
      padding: 60px 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
    }

    .loading p {
      font-size: 15px;
    }

    .reports-grid {
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 32px;
    }

    .report-card {
      padding: 24px;
      border-radius: 20px;
    }

    .report-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .report-url h3 {
      font-size: 16px;
      margin-bottom: 6px;
    }

    .scan-date {
      font-size: 13px;
    }

    .status-badge {
      font-size: 12px;
      padding: 4px 10px;
      align-self: flex-start;
    }

    .report-score {
      padding: 20px 0;
    }

    .score-circle {
      width: 100px;
      margin: 0 auto 12px;
    }

    .score-label {
      font-size: 13px;
    }

    .report-actions {
      flex-direction: column;
      gap: 10px;
    }

    .report-actions .button {
      width: 100%;
      padding: 12px 20px;
      font-size: 15px;
    }

    .empty-state {
      padding: 60px 1.5rem;
      border-radius: 20px;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .empty-state h2 {
      font-size: 24px;
    }

    .empty-state p {
      font-size: 14px;
      margin-bottom: 24px;
    }

    .button-primary {
      font-size: 15px;
      padding: 11px 20px;
    }

    .reports-summary {
      font-size: 13px;
      padding: 20px 0;
    }

    .bg-grid {
      background-size: 30px 30px;
    }

    .bg-blur-top {
      display: none;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .page-header h1 {
      font-size: 28px;
    }

    .report-card {
      padding: 20px;
    }

    .report-url h3 {
      font-size: 15px;
    }

    .status-badge {
      font-size: 11px;
      padding: 3px 8px;
    }

    .empty-state {
      padding: 48px 1rem;
    }

    .empty-icon {
      font-size: 3.5rem;
    }

    .empty-state h2 {
      font-size: 22px;
    }
  }
</style>
