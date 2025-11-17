<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let websiteUrl = '';
  let isSubmitting = false;

  async function handleScan() {
    if (!websiteUrl.trim()) return;
    isSubmitting = true;
    const encodedUrl = encodeURIComponent(websiteUrl);
    await goto(`/scan?url=${encodedUrl}`);
  }
</script>

<svelte:head>
  <title>Complete AI Veryfing Compliance Assurance System</title>
  <meta name="description" content="We verify 95-99% of your AI responses for bias, toxicity, and policy violations via API, Slack, and web." />
</svelte:head>

<!-- Background decorations -->
<div class="bg-grid"></div>
<div class="bg-blur-top"></div>
<div class="bg-blur-bottom"></div>

<div class="hero">
  <div class="badge">
    <div class="avatars">
      <img src="/avatar1.png" alt="User" class="avatar" />
      <img src="/avatar2.png" alt="User" class="avatar" />
      <img src="/avatar3.png" alt="User" class="avatar" />
    </div>
   <div>
     <div class="stars-wrapper">
      <span class="star">★</span>
      <span class="star">★</span>
      <span class="star">★</span>
      <span class="star">★</span>
      <span class="star">★</span>
    </div>
    <span class="users-count">Used by 220 users</span>
   </div>
  </div>

  <h1 class="title">
    <span class="title-white">AI Powered</span> <span class="shield-icon"><img src="/logo.svg" alt="Shield" /></span> <span class="title-gray">Legal</span><br/>
    <span class="title-white">Compliance </span> <span class="title-gray">For Non-Profits</span>
  </h1>

  <p class="subtitle">
    We scan your non-profit's website to make sure it follows the specific laws for your region
  </p>

  <div class="scan-form">
    <input
      type="text"
      bind:value={websiteUrl}
      placeholder="https://humdum.org"
      class="url-input"
      disabled={isSubmitting}
    />
    <button on:click={handleScan} class="scan-button" disabled={isSubmitting}>
      Scan
    </button>
  </div>
</div>

<div class="features">
  <div class="feature-card">
    <div class="feature-icon">
      <img src="/icon-lock.svg" alt="Security" />
    </div>
    <h3>Security Check</h3>
    <p>Verify SSL certificates and HTTPS implementation</p>
  </div>

  <div class="feature-card">
    <div class="feature-icon">
      <img src="/icon-scale.svg" alt="GDPR" />
    </div>
    <h3>GDPR Compliance</h3>
    <p>Check DSAR processes and data processor disclosures</p>
  </div>

  <div class="feature-card">
    <div class="feature-icon">
      <img src="/icon-document.svg" alt="Policy" />
    </div>
    <h3>Policy Check</h3>
    <p>Verify Privacy, Cookie, and Safeguarding policies</p>
  </div>
</div>

<style>
  :global(body) {
    background-color: #020202;
    color: #ffffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    overflow-x: hidden;
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

  .bg-blur-bottom {
    position: absolute;
    bottom: -400px;
    left: 50%;
    transform: translateX(-50%);
    width: 1000px;
    height: 1000px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%);
    filter: blur(100px);
    pointer-events: none;
    z-index: 0;
  }

  .hero {
    text-align: center;
    padding: 80px 2rem 0;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.25);
    padding: 8px 16px;
    border-radius: 49px;
    margin-bottom: 40px;
    animation: fadeInDown 0.8s ease-out;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .avatars {
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-left: -8px;
    border: 2px solid #020202;
    transition: transform 0.3s;
  }

  .badge:hover .avatar {
    transform: translateY(-2px);
  }

  .badge:hover .avatar:nth-child(2) {
    transition-delay: 0.05s;
  }

  .badge:hover .avatar:nth-child(3) {
    transition-delay: 0.1s;
  }

  .avatar:first-child {
    margin-left: 0;
  }

  .stars-wrapper {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-left: 4px;
  }

  .star {
    color: #FFA500;
    font-size: 17px;
    line-height: 1;
    display: inline-block;
    animation: starTwinkle 2s ease-in-out infinite;
  }

  .star:nth-child(1) { animation-delay: 0s; }
  .star:nth-child(2) { animation-delay: 0.2s; }
  .star:nth-child(3) { animation-delay: 0.4s; }
  .star:nth-child(4) { animation-delay: 0.6s; }
  .star:nth-child(5) { animation-delay: 0.8s; }

  @keyframes starTwinkle {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(0.95);
    }
  }

  .users-count {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin-left: 8px;
  }

  @keyframes shine {
    0% {
      background-position: -200% center;
    }
    100% {
      background-position: 200% center;
    }
  }

  .title {
    font-family: 'Inter', sans-serif;
    font-size: 72px;
    font-weight: 600;
    line-height: 89%;
    letter-spacing: -1.94px;
    margin-bottom: 24px;
    text-align: center;
    position: relative;
    animation: fadeInUp 1s ease-out 0.2s both;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .title-white {
    background: linear-gradient(
      90deg,
      #ffffff 0%,
      #ffffff 30%,
      #f0f0f0 45%,
      #ffffff 50%,
      #f0f0f0 55%,
      #ffffff 70%,
      #ffffff 100%
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s linear infinite;
  }

  .title-gray {
    background: linear-gradient(
      90deg,
      #6b7280 0%,
      #6b7280 30%,
      #9ca3af 45%,
      #d1d5db 50%,
      #9ca3af 55%,
      #6b7280 70%,
      #6b7280 100%
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s linear infinite;
  }

  .shield-icon {
    display: inline-block;
    vertical-align: middle;
    width: 90px;
    height: 90px;
    margin: 0 4px;
    animation: floatAnimation 3s ease-in-out infinite;
  }

  @keyframes floatAnimation {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .shield-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: rotateGlow 4s ease-in-out infinite;
  }

  @keyframes rotateGlow {
    0%, 100% {
      filter: drop-shadow(0 0 10px rgba(34, 139, 255, 0.5));
    }
    50% {
      filter: drop-shadow(0 0 20px rgba(34, 139, 255, 0.8));
    }
  }

  .subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    color: #9ca3af;
    margin-bottom: 48px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    animation: fadeIn 1s ease-out 0.4s both;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .scan-form {
    display: flex;
    align-items: center;
    max-width: 500px;
    margin: 0 auto 80px;
    gap: 0;
    position: relative;
    animation: scaleIn 0.8s ease-out 0.6s both;
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .url-input {
    flex: 1;
    padding: 0 20px;
    height: 48px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    color: #9ca3af;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s;
  }

  .url-input::placeholder {
    color: #6b7280;
  }

  .url-input:focus {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .scan-button {
    padding: 0 32px;
    height: 48px;
    background: #228bff;
    border: none;
    border-radius: 12px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
    margin-left: -1px;
    position: relative;
    overflow: hidden;
  }

  .scan-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .scan-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(34, 139, 255, 0.4);
  }

  .scan-button:hover::before {
    width: 300px;
    height: 300px;
  }

  .scan-button:active {
    transform: translateY(0);
  }

  .scan-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(3, 200px);
    gap: 32px;
    justify-content: center;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 32px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s;
    animation: slideInUp 0.8s ease-out both;
  }

  .feature-card:nth-child(1) {
    animation-delay: 0.8s;
  }

  .feature-card:nth-child(2) {
    animation-delay: 1s;
  }

  .feature-card:nth-child(3) {
    animation-delay: 1.2s;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .feature-card:hover {
    transform: translateY(-8px) scale(1.05);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 30px rgba(34, 139, 255, 0.2);
  }

  .feature-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    transition: transform 0.3s;
  }

  .feature-card:hover .feature-icon {
    transform: rotate(10deg) scale(1.1);
  }

  .feature-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(34, 139, 255, 0.3));
  }

  .feature-card h3 {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 8px;
    color: #ffffff;
  }

  .feature-card p {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  /* Tablet Responsive - iPad */
  @media (max-width: 1024px) {
    .hero {
      padding: 60px 1.5rem 0;
    }

    .title {
      font-size: 56px;
    }

    .shield-icon {
      width: 70px;
      height: 70px;
    }

    .subtitle {
      font-size: 17px;
      max-width: 550px;
    }

    .scan-form {
      max-width: 480px;
    }

    .features {
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      padding: 0 1.5rem;
    }

    .feature-card {
      padding: 32px 20px;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .hero {
      padding: 40px 1rem 0;
    }

    .badge {
      font-size: 13px;
      padding: 6px 12px;
      margin-bottom: 24px;
      gap: 6px;
    }

    .avatar {
      width: 24px;
      height: 24px;
      margin-left: -6px;
    }

    .stars-wrapper {
      gap: 1px;
    }

    .star {
      font-size: 14px;
    }

    .users-count {
      font-size: 13px;
      margin-left: 6px;
    }

    .title {
      font-size: 42px;
      line-height: 1.1;
      margin-bottom: 16px;
      letter-spacing: -1px;
    }

    .shield-icon {
      width: 54px;
      height: 54px;
      margin: 0 2px;
    }

    .subtitle {
      font-size: 15px;
      margin-bottom: 32px;
      padding: 0 0.5rem;
    }

    .scan-form {
      flex-direction: column;
      max-width: 100%;
      margin-bottom: 60px;
      gap: 12px;
    }

    .url-input {
      width: 100%;
      border-radius: 12px;
      height: 48px;
      font-size: 15px;
      padding: 0 16px;
    }

    .scan-button {
      width: 100%;
      border-radius: 12px;
      margin-left: 0;
      height: 48px;
      font-size: 15px;
    }

    .features {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 0 1rem;
    }

    .feature-card {
      padding: 28px 20px;
      border-radius: 20px;
    }

    .feature-icon {
      width: 56px;
      height: 56px;
      margin-bottom: 16px;
    }

    .feature-icon img {
      width: 100%;
      height: 100%;
    }

    .feature-card h3 {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .feature-card p {
      font-size: 13px;
    }

    .bg-grid {
      background-size: 30px 30px;
    }

    .bg-blur-top,
    .bg-blur-bottom {
      display: none;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .hero {
      padding: 32px 0.875rem 0;
    }

    .badge {
      font-size: 12px;
      padding: 5px 10px;
    }

    .avatar {
      width: 20px;
      height: 20px;
    }

    .star {
      font-size: 13px;
    }

    .users-count {
      font-size: 12px;
    }

    .title {
      font-size: 36px;
    }

    .shield-icon {
      width: 48px;
      height: 48px;
    }

    .subtitle {
      font-size: 14px;
    }

    .url-input {
      height: 46px;
      font-size: 16px; /* Prevents zoom on iOS */
    }

    .scan-button {
      height: 46px;
      font-size: 14px;
    }

    .feature-card {
      padding: 24px 18px;
    }

    .feature-card h3 {
      font-size: 15px;
    }

    .feature-card p {
      font-size: 12px;
    }
  }
</style>
