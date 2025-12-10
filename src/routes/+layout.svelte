<script lang="ts">
  import { navigating, page } from '$app/stores';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ScanProgress from '$lib/components/ScanProgress.svelte';
  import '../app.css';

  // Show loading screen when navigating to scan page
  $: isScanning = $navigating && $navigating.to?.route.id === '/scan';
  $: scannedUrl = $page.url.searchParams.get('url') || '';
</script>

{#if isScanning}
  <!-- Full-page loading overlay for scan page -->
  <ScanProgress url={scannedUrl} />
{:else}
  <div class="app-container">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
{/if}

<style>
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
  }
</style>
