<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api/client';
  import ReportDisplay from '$lib/components/ReportDisplay.svelte';
  import type { ComplianceReport } from '$lib/utils/types';

  let report: ComplianceReport | null = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    // Redirect to login if not authenticated
    if (!$authStore.isAuthenticated || !$authStore.accessToken) {
      goto('/login');
      return;
    }

    const reportId = parseInt($page.params.id);

    if (isNaN(reportId)) {
      error = 'Invalid report ID';
      loading = false;
      return;
    }

    try {
      const response = await api.getReport($authStore.accessToken, reportId);
      report = response.report.report_data;
    } catch (err: any) {
      error = err.message || 'Failed to load report';
    } finally {
      loading = false;
    }
  });

  async function deleteReport() {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    const reportId = parseInt($page.params.id);

    try {
      await api.deleteReport($authStore.accessToken!, reportId);
      goto('/reports');
    } catch (err) {
      alert('Failed to delete report');
    }
  }
</script>

<svelte:head>
  <title>Report Details - Legal Compliance Checker</title>
</svelte:head>

<!-- Background decorations -->
<div class="bg-grid"></div>
<div class="bg-blur-top"></div>

<main>
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading report...</p>
    </div>
  {:else if error}
    <div class="error-state">
      <h2>Error Loading Report</h2>
      <p>{error}</p>
      <div class="error-actions">
        <a href="/reports" class="button">Back to Reports</a>
        <a href="/" class="button button-primary">Go Home</a>
      </div>
    </div>
  {:else if report}
    <div class="report-header">
      <div class="header-content">
        <a href="/reports" class="back-link">← Back to Reports</a>
        <h1>Report Details</h1>
      </div>
      <button class="button button-danger" on:click={deleteReport}>
        Delete Report
      </button>
    </div>

    <ReportDisplay {report} />
  {:else}
    <div class="error-state">
      <h2>Report Not Found</h2>
      <p>The report you're looking for doesn't exist or you don't have permission to view it.</p>
      <a href="/reports" class="button">Back to Reports</a>
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

  .error-state {
    text-align: center;
    padding: 80px 2rem;
    max-width: 600px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    backdrop-filter: blur(10px);
  }

  .error-state h2 {
    font-family: 'Inter', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #ff3b30;
    margin-bottom: 12px;
  }

  .error-state p {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #9ca3af;
    margin-bottom: 32px;
  }

  .error-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
  }

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .header-content h1 {
    font-family: 'Inter', sans-serif;
    font-size: 32px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }

  .back-link {
    display: inline-block;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #228bff;
    margin-bottom: 12px;
    transition: opacity 0.2s;
    text-decoration: none;
  }

  .back-link:hover {
    opacity: 0.8;
  }

  .button {
    padding: 10px 20px;
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

  .button:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .button-primary {
    background: #228bff;
    border-color: #228bff;
  }

  .button-primary:hover {
    opacity: 0.9;
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

  @media (max-width: 768px) {
    main {
      padding: 60px 1rem 20px;
    }

    .report-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      padding-bottom: 16px;
      margin-bottom: 32px;
    }

    .header-content h1 {
      font-size: 24px;
    }

    .back-link {
      font-size: 13px;
      margin-bottom: 8px;
    }

    .button {
      padding: 10px 18px;
      font-size: 13px;
    }

    .error-state {
      padding: 60px 1.5rem;
    }

    .error-state h2 {
      font-size: 22px;
    }

    .error-state p {
      font-size: 14px;
      margin-bottom: 24px;
    }

    .error-actions {
      flex-direction: column;
      gap: 12px;
    }

    .error-actions .button {
      width: 100%;
    }

    .bg-grid {
      background-size: 30px 30px;
    }

    .bg-blur-top {
      display: none;
    }
  }
</style>
