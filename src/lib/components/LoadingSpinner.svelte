<script lang="ts">
  export let message = 'Scanning website...';
</script>

<div class="loading-container">
  <div class="spinner"></div>
  <p class="message">{message}</p>
  <p class="submessage">This may take a few moments</p>
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xxl);
    min-height: 400px;
  }

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid var(--color-bg-secondary);
    border-top: 4px solid var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .message {
    margin-top: var(--spacing-lg);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .submessage {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-top: var(--spacing-sm);
    opacity: 0.8;
  }
</style>
