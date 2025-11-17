<script lang="ts">
  import { goto } from '$app/navigation';

  let websiteUrl = '';
  let isSubmitting = false;
  let error = '';

  function validateUrl(url: string): boolean {
    if (!url.trim()) {
      error = 'Please enter a website URL';
      return false;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/.*)?$/i;
    if (!urlPattern.test(url)) {
      error = 'Please enter a valid website URL';
      return false;
    }

    error = '';
    return true;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!validateUrl(websiteUrl)) {
      return;
    }

    isSubmitting = true;

    // Navigate to scan page with URL as query parameter
    const encodedUrl = encodeURIComponent(websiteUrl);
    await goto(`/scan?url=${encodedUrl}`);
  }
</script>

<form on:submit={handleSubmit}>
  <div class="form-group">
    <label for="url">Enter your charity's website URL</label>
    <input
      id="url"
      type="text"
      class="input"
      bind:value={websiteUrl}
      placeholder="https://example.org"
      disabled={isSubmitting}
      on:input={() => error = ''}
    />
    {#if error}
      <p class="error">{error}</p>
    {/if}
  </div>

  <button type="submit" class="button" disabled={isSubmitting}>
    {isSubmitting ? 'Starting Scan...' : 'Scan Website'}
  </button>
</form>

<style>
  form {
    max-width: 600px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  label {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
  }

  .error {
    color: var(--status-threat);
    font-size: 0.875rem;
    margin-top: var(--spacing-sm);
    margin-bottom: 0;
  }

  button {
    width: 100%;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
</style>
