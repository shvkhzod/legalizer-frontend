<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api/client';
  import ReportDisplay from '$lib/components/ReportDisplay.svelte';

  export let data: PageData;

  let saving = false;
  let saved = false;
  let saveError = '';

  // Automatically save report when page loads (if user is authenticated)
  onMount(async () => {
    if ($authStore.isAuthenticated && $authStore.accessToken && data.report && !saved) {
      await saveReport();
    }
  });

  async function saveReport() {
    if (!$authStore.accessToken || !data.report) return;

    saving = true;
    saveError = '';

    try {
      await api.createReport($authStore.accessToken, data.report);
      saved = true;
    } catch (err: any) {
      saveError = err.message || 'Failed to save report';
      console.error('Save error:', err);
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>Scan Results - Legal Compliance Checker</title>
</svelte:head>

<!-- Background decorations -->
<div class="bg-grid"></div>
<div class="bg-blur-top"></div>

<div class="scan-container">
  {#if saved}
    <div class="save-notification success">
      <span class="notification-icon">✓</span>
      <span class="notification-text">Report saved successfully! <a href="/reports">View all reports</a></span>
    </div>
  {:else if saving}
    <div class="save-notification">
      <span class="notification-icon spinner-icon">⟳</span>
      <span class="notification-text">Saving report...</span>
    </div>
  {:else if saveError}
    <div class="save-notification error">
      <span class="notification-icon">✗</span>
      <span class="notification-text">{saveError}</span>
    </div>
  {/if}

  {#if data.report}
    <ReportDisplay report={data.report} />
  {:else}
    <div class="error-state">
      <h2>Unable to load report</h2>
      <p>Please try again or contact support if the issue persists.</p>
      <a href="/" class="button">Go Home</a>
    </div>
  {/if}
</div>

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

  .scan-container {
    position: relative;
    z-index: 1;
    padding: 80px 2rem 40px;
    max-width: 1200px;
    margin: 0 auto;
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .save-notification {
    background: rgba(34, 139, 255, 0.1);
    border: 1px solid rgba(34, 139, 255, 0.3);
    color: #228bff;
    padding: 16px 24px;
    border-radius: 16px;
    margin-bottom: 32px;
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    backdrop-filter: blur(10px);
    animation: slideDown 0.5s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .save-notification.success {
    background: rgba(52, 199, 89, 0.1);
    border-color: rgba(52, 199, 89, 0.3);
    color: #34c759;
  }

  .save-notification.error {
    background: rgba(255, 59, 48, 0.1);
    border-color: rgba(255, 59, 48, 0.3);
    color: #ff3b30;
  }

  .notification-icon {
    font-size: 20px;
    font-weight: bold;
  }

  .spinner-icon {
    display: inline-block;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .notification-text {
    font-weight: 500;
  }

  .save-notification a {
    color: inherit;
    text-decoration: underline;
    font-weight: 600;
    margin-left: 4px;
    transition: opacity 0.2s;
  }

  .save-notification a:hover {
    opacity: 0.8;
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
    animation: fadeInScale 0.6s ease-out;
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
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

  .button {
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

  .button:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  /* Tablet Responsive */
  @media (max-width: 1024px) {
    .scan-container {
      padding: 60px 1.5rem 40px;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .scan-container {
      padding: 60px 1rem 20px;
    }

    .bg-grid {
      background-size: 30px 30px;
    }

    .bg-blur-top {
      display: none;
    }

    .save-notification {
      flex-direction: column;
      gap: 8px;
      padding: 12px 16px;
      font-size: 14px;
      border-radius: 14px;
      margin-bottom: 24px;
    }

    .notification-icon {
      font-size: 18px;
    }

    .notification-text {
      font-size: 14px;
      text-align: center;
    }

    .save-notification a {
      display: block;
      margin-left: 0;
      margin-top: 4px;
    }

    .error-state {
      padding: 60px 1.5rem;
      border-radius: 20px;
    }

    .error-state h2 {
      font-size: 22px;
    }

    .error-state p {
      font-size: 14px;
      margin-bottom: 24px;
    }

    .button {
      font-size: 15px;
      padding: 11px 20px;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .scan-container {
      padding: 48px 0.875rem 20px;
    }

    .save-notification {
      padding: 10px 14px;
      font-size: 13px;
    }

    .notification-icon {
      font-size: 16px;
    }

    .error-state {
      padding: 48px 1rem;
    }

    .error-state h2 {
      font-size: 20px;
    }

    .error-state p {
      font-size: 13px;
    }

    .button {
      font-size: 14px;
    }
  }
</style>
