<script lang="ts">
  import { onMount } from 'svelte';

  export let url: string;

  let currentStep = 0;
  let dots = '';

  const steps = [
    { id: 1, label: 'Fetching homepage', duration: 2000 },
    { id: 2, label: 'Scanning policy pages', duration: 3000 },
    { id: 3, label: 'Reading documents', duration: 4000 },
    { id: 4, label: 'AI analysis in progress', duration: 15000 }
  ];

  onMount(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      dots = dots.length >= 3 ? '' : dots + '.';
    }, 500);

    // Progress through steps
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        currentStep = stepIndex;
      }
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stepInterval);
    };
  });
</script>

<div class="scan-progress-container">
  <!-- Background decorations -->
  <div class="bg-grid"></div>
  <div class="bg-blur"></div>

  <div class="progress-card">
    <!-- Animated scanner icon -->
    <div class="scanner-icon">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
        <circle cx="12" cy="12" r="10" class="scanning-circle" stroke-dasharray="63" stroke-dashoffset="0"/>
        <path d="M12 6v6l4 2" stroke-linecap="round"/>
      </svg>
      <div class="pulse-ring"></div>
    </div>

    <!-- URL being scanned -->
    <h2 class="scanning-url">Scanning {url}</h2>

    <!-- Progress steps -->
    <div class="steps">
      {#each steps as step, index}
        <div class="step" class:active={index === currentStep} class:completed={index < currentStep}>
          <div class="step-indicator">
            {#if index < currentStep}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {:else if index === currentStep}
              <div class="spinner"></div>
            {:else}
              <div class="step-number">{step.id}</div>
            {/if}
          </div>
          <span class="step-label">
            {step.label}
            {#if index === currentStep}
              <span class="dots">{dots}</span>
            {/if}
          </span>
        </div>
      {/each}
    </div>

    <!-- Info message -->
    <p class="info-message">
      This may take 15-30 seconds. Our AI is carefully analyzing your website's legal compliance.
    </p>
  </div>
</div>

<style>
  .scan-progress-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    jwhyify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

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
    mask-image: radial-gradient(ellipse 800px 600px at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse 800px 600px at center, black 0%, transparent 70%);
  }

  .bg-blur {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(34, 139, 255, 0.3) 0%, rgba(34, 139, 255, 0.15) 30%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    animation: pulse 3s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.8;
    }
  }

  .progress-card {
    position: relative;
    z-index: 1;
    max-width: 420px;
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 32px 28px;
    text-align: center;
    backdrop-filter: blur(20px);
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

  .scanner-icon {
    position: relative;
    display: inline-block;
    margin-bottom: 24px;
  }

  .scanner-icon svg {
    width: 64px;
    height: 64px;
    color: #228bff;
    animation: rotate 3s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .scanning-circle {
    stroke: #228bff;
    stroke-dasharray: 63;
    stroke-dashoffset: 0;
    animation: scan 2s ease-in-out infinite;
  }

  @keyframes scan {
    0% {
      stroke-dashoffset: 63;
      transform: rotate(0deg);
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -63;
      transform: rotate(360deg);
    }
  }

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border: 2px solid #228bff;
    border-radius: 50%;
    opacity: 0.6;
    animation: pulseRing 2s ease-out infinite;
  }

  @keyframes pulseRing {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }

  .scanning-url {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 24px;
    word-break: break-all;
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .step.active {
    background: rgba(34, 139, 255, 0.1);
    border-color: rgba(34, 139, 255, 0.3);
    box-shadow: 0 0 20px rgba(34, 139, 255, 0.2);
  }

  .step.completed {
    background: rgba(52, 199, 89, 0.05);
    border-color: rgba(52, 199, 89, 0.2);
  }

  .step-indicator {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .step.active .step-indicator {
    background: rgba(34, 139, 255, 0.2);
    border-color: #228bff;
  }

  .step.completed .step-indicator {
    background: rgba(52, 199, 89, 0.2);
    border-color: #34c759;
  }

  .step.completed .step-indicator svg {
    color: #34c759;
  }

  .step-number {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #9ca3af;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(34, 139, 255, 0.3);
    border-top-color: #228bff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .step-label {
    flex: 1;
    text-align: left;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #9ca3af;
    transition: color 0.3s ease;
  }

  .step.active .step-label {
    color: #ffffff;
  }

  .step.completed .step-label {
    color: #34c759;
  }

  .dots {
    display: inline-block;
    min-width: 20px;
    text-align: left;
  }

  .info-message {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .scan-progress-container {
      padding: 1rem;
    }

    .progress-card {
      padding: 32px 24px;
      border-radius: 24px;
    }

    .scanner-icon svg {
      width: 64px;
      height: 64px;
    }

    .scanning-url {
      font-size: 16px;
      margin-bottom: 24px;
    }

    .step {
      padding: 12px 16px;
      gap: 12px;
    }

    .step-indicator {
      width: 28px;
      height: 28px;
    }

    .step-label {
      font-size: 14px;
    }

    .info-message {
      font-size: 12px;
    }

    .bg-grid {
      background-size: 30px 30px;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .progress-card {
      padding: 28px 20px;
    }

    .scanner-icon svg {
      width: 56px;
      height: 56px;
    }

    .scanning-url {
      font-size: 15px;
    }

    .steps {
      gap: 16px;
    }

    .step {
      padding: 10px 14px;
      border-radius: 12px;
    }

    .step-indicator {
      width: 26px;
      height: 26px;
    }

    .spinner {
      width: 14px;
      height: 14px;
    }

    .step-label {
      font-size: 13px;
    }
  }
</style>
