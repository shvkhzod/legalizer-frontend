<script lang="ts">
  import type { ComplianceCheck } from '$lib/utils/types';

  export let check: ComplianceCheck;

  function getStatusColor(status: string): string {
    switch (status) {
      case 'Compliant':
        return 'var(--status-good)';
      case 'Warning':
        return 'var(--status-warning)';
      case 'Non-Compliant':
        return 'var(--status-threat)';
      case 'Info':
        return 'var(--status-info)';
      default:
        return 'var(--color-text-secondary)';
    }
  }

  function getStatusIcon(status: string): string {
    switch (status) {
      case 'Compliant':
        return '✓';
      case 'Warning':
        return '⚠';
      case 'Non-Compliant':
        return '✗';
      case 'Info':
        return 'ℹ';
      default:
        return '';
    }
  }
</script>

<div class="report-card">
  <div class="card-header">
    <div class="status-badge" style="background-color: {getStatusColor(check.status)};">
      <span class="status-icon">{getStatusIcon(check.status)}</span>
      <span class="status-text">{check.status}</span>
    </div>
    <h3>{check.title}</h3>
  </div>

  <div class="card-body">
    <p class="summary">{check.summary}</p>
    <div class="recommendation">
      <strong>Recommendation:</strong>
      <p>{check.recommendation}</p>
    </div>
  </div>
</div>

<style>
  .report-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
    backdrop-filter: blur(10px);
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    animation: slideInUp 0.5s ease-out both;
  }

  .report-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }

  .report-card:nth-child(1) { animation-delay: 0.05s; }
  .report-card:nth-child(2) { animation-delay: 0.1s; }
  .report-card:nth-child(3) { animation-delay: 0.15s; }
  .report-card:nth-child(4) { animation-delay: 0.2s; }
  .report-card:nth-child(5) { animation-delay: 0.25s; }
  .report-card:nth-child(6) { animation-delay: 0.3s; }

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

  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
    }
  }

  .status-icon {
    font-size: 14px;
    animation: bounce 1s ease-in-out;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  .card-header h3 {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }

  .card-body {
    margin-top: 16px;
  }

  .summary {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #e5e7eb;
    margin-bottom: 16px;
    line-height: 1.6;
  }

  .recommendation {
    background: rgba(255, 255, 255, 0.05);
    padding: 16px;
    border-radius: 8px;
    border-left: 3px solid #228bff;
  }

  .recommendation strong {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
    display: block;
    margin-bottom: 8px;
  }

  .recommendation p {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #9ca3af;
    margin: 0;
    line-height: 1.5;
  }

  /* Tablet Responsive */
  @media (max-width: 1024px) {
    .report-card {
      padding: 20px;
    }

    .card-header h3 {
      font-size: 17px;
    }

    .summary {
      font-size: 13px;
    }

    .recommendation {
      padding: 14px;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .report-card {
      padding: 20px;
      margin-bottom: 12px;
      border-radius: 14px;
    }

    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 14px;
    }

    .status-badge {
      padding: 5px 10px;
      font-size: 12px;
      align-self: flex-start;
    }

    .status-icon {
      font-size: 13px;
    }

    .card-header h3 {
      font-size: 16px;
    }

    .card-body {
      margin-top: 12px;
    }

    .summary {
      font-size: 13px;
      margin-bottom: 14px;
      line-height: 1.5;
    }

    .recommendation {
      padding: 14px;
      border-radius: 6px;
      border-left-width: 2px;
    }

    .recommendation strong {
      font-size: 12px;
      margin-bottom: 6px;
    }

    .recommendation p {
      font-size: 12px;
      line-height: 1.4;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .report-card {
      padding: 16px;
    }

    .card-header {
      gap: 10px;
    }

    .status-badge {
      padding: 4px 8px;
      font-size: 11px;
    }

    .card-header h3 {
      font-size: 15px;
    }

    .summary {
      font-size: 12px;
    }

    .recommendation {
      padding: 12px;
    }

    .recommendation strong {
      font-size: 11px;
    }

    .recommendation p {
      font-size: 11px;
    }
  }
</style>
