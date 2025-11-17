<script lang="ts">
  import { onMount } from 'svelte';

  let scrollY = 0;
  let statsVisible = false;

  onMount(() => {
    const handleScroll = () => {
      scrollY = window.scrollY;

      // Check if stats section is visible
      const statsSection = document.querySelector('.stats-grid');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && !statsVisible) {
          statsVisible = true;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const stats = [
    { number: 95, suffix: '%', label: 'Compliance Accuracy', delay: 0 },
    { number: 50, suffix: '+', label: 'Compliance Checks', delay: 0.1 },
    { number: 220, suffix: '+', label: 'Organizations Served', delay: 0.2 },
    { number: 24, suffix: '/7', label: 'AI-Powered Monitoring', delay: 0.3 }
  ];

  const features = [
    {
      iconPath: '/icon-lock.svg',
      title: 'Security First',
      description: 'SSL/TLS verification and HTTPS implementation checks to ensure your data is protected.'
    },
    {
      iconPath: '/icon-scale.svg',
      title: 'GDPR Compliance',
      description: 'Comprehensive DSAR process verification and data processor disclosure analysis.'
    },
    {
      iconPath: '/icon-document.svg',
      title: 'Policy Verification',
      description: 'Automated checking of Privacy, Cookie, and Safeguarding policies for completeness.'
    },
    {
      iconPath: '/icon-lock.svg',
      title: 'Payment Security',
      description: 'PCI DSS compliance checks and secure payment processing verification.'
    },
    {
      iconPath: '/icon-document.svg',
      title: 'Member Data Protection',
      description: 'Safeguarding of member data and copyright compliance verification.'
    },
    {
      iconPath: '/logo.svg',
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms for intelligent compliance detection.'
    }
  ];

  const team = [
    {
      role: 'AI & Compliance',
      description: 'Our AI engine analyzes thousands of compliance factors in seconds'
    },
    {
      role: 'Legal Framework',
      description: 'Built on comprehensive legal databases and regulatory requirements'
    },
    {
      role: 'Continuous Updates',
      description: 'Regular updates to match evolving compliance standards'
    }
  ];
</script>

<svelte:head>
  <title>About - Legal Compliance Checker</title>
  <meta name="description" content="Learn about our AI-powered legal compliance platform for non-profits." />
</svelte:head>

<!-- Background decorations -->
<div class="bg-grid"></div>
<div class="bg-blur-top" style="transform: translateX(-50%) translateY({scrollY * 0.3}px);"></div>
<div class="bg-blur-middle"></div>

<div class="about-container">
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-badge">
      <span class="badge-dot"></span>
      <span>Trusted by 220+ Organizations</span>
    </div>

    <h1 class="hero-title">
      Empowering Non-Profits with
      <br/>AI-Powered Compliance
    </h1>

    <p class="hero-subtitle">
      We believe every non-profit deserves access to world-class compliance tools.
      Our platform combines cutting-edge AI with deep legal expertise to help organizations
      stay compliant, secure, and focused on their mission.
    </p>

    <div class="hero-actions">
      <a href="/" class="btn-primary">
        Start Free Scan
        <span class="btn-arrow">→</span>
      </a>
      <a href="/reports" class="btn-secondary">
        View Reports
      </a>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="stats-section">
    <div class="stats-grid">
      {#each stats as stat}
        <div class="stat-card" style="animation-delay: {stat.delay}s" class:visible={statsVisible}>
          <div class="stat-number">
            <span class="number">{statsVisible ? stat.number : 0}</span>
            <span class="suffix">{stat.suffix}</span>
          </div>
          <div class="stat-label">{stat.label}</div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Mission Section -->
  <section class="mission-section">
    <div class="section-header">
      <span class="section-tag">Our Mission</span>
      <h2>Making Compliance Accessible for All</h2>
    </div>

    <div class="mission-content">
      <div class="mission-card main-mission">
        <div class="mission-icon">🎯</div>
        <h3>Why We Exist</h3>
        <p>
          Legal compliance shouldn't be a barrier to doing good. We built this platform
          because we saw too many non-profits struggling with complex compliance requirements,
          draining resources that could be used for their core mission.
        </p>
        <p>
          Our AI-powered solution democratizes access to compliance expertise, making it
          affordable and accessible for organizations of all sizes.
        </p>
      </div>

      <div class="mission-grid">
        {#each team as item, i}
          <div class="mission-card" style="animation-delay: {0.1 * i}s">
            <div class="card-number">{String(i + 1).padStart(2, '0')}</div>
            <h4>{item.role}</h4>
            <p>{item.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Features Grid -->
  <section class="features-section">
    <div class="section-header">
      <span class="section-tag">Features</span>
      <h2>Comprehensive Compliance Coverage</h2>
    </div>

    <div class="features-grid">
      {#each features as feature, i}
        <div class="feature-card" style="animation-delay: {0.1 * i}s">
          <div class="feature-icon-wrapper">
            <img src={feature.iconPath} alt={feature.title} class="feature-icon" />
          </div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          <div class="feature-shine"></div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Technology Section -->
  <section class="tech-section">
    <div class="section-header">
      <span class="section-tag">Technology</span>
      <h2>Powered by Advanced AI</h2>
    </div>

    <div class="tech-grid">
      <div class="tech-card">
        <div class="tech-visual">
          <div class="pulse-ring"></div>
          <div class="pulse-ring" style="animation-delay: 0.5s;"></div>
          <div class="pulse-ring" style="animation-delay: 1s;"></div>
          <div class="tech-icon">🧠</div>
        </div>
        <h3>Machine Learning</h3>
        <p>Our AI models are trained on thousands of compliance cases, constantly learning and improving accuracy.</p>
      </div>

      <div class="tech-card">
        <div class="tech-visual">
          <div class="orbit-container">
            <div class="orbit-ring"></div>
            <div class="orbit-dot orbit-dot-1"></div>
            <div class="orbit-dot orbit-dot-2"></div>
            <div class="orbit-dot orbit-dot-3"></div>
          </div>
          <div class="tech-icon">⚡</div>
        </div>
        <h3>Real-Time Analysis</h3>
        <p>Instant compliance reports powered by distributed computing and intelligent caching.</p>
      </div>

      <div class="tech-card">
        <div class="tech-visual">
          <div class="data-bars">
            <div class="data-bar" style="animation-delay: 0s;"></div>
            <div class="data-bar" style="animation-delay: 0.2s;"></div>
            <div class="data-bar" style="animation-delay: 0.4s;"></div>
            <div class="data-bar" style="animation-delay: 0.6s;"></div>
          </div>
          <div class="tech-icon">📊</div>
        </div>
        <h3>Comprehensive Database</h3>
        <p>Access to up-to-date legal frameworks and compliance requirements across multiple jurisdictions.</p>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="cta-card">
      <h2>Ready to Ensure Compliance?</h2>
      <p>Join 220+ organizations using our platform to stay compliant and secure.</p>
      <a href="/" class="btn-primary btn-large">
        Start Your Free Scan
        <span class="btn-arrow">→</span>
      </a>
    </div>
  </section>
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
    position: fixed;
    top: -200px;
    left: 50%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(34, 139, 255, 0.25) 0%, rgba(34, 139, 255, 0.12) 30%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    transition: transform 0.1s ease-out;
  }

  .bg-blur-middle {
    position: absolute;
    top: 50%;
    right: -300px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%);
    filter: blur(100px);
    pointer-events: none;
    z-index: 0;
  }

  .about-container {
    position: relative;
    z-index: 1;
    padding: 80px 2rem 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Hero Section */
  .hero-section {
    text-align: center;
    padding: 60px 0 100px;
    animation: fadeInUp 1s ease-out;
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

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(52, 199, 89, 0.1);
    border: 1px solid rgba(52, 199, 89, 0.3);
    padding: 8px 16px;
    border-radius: 50px;
    margin-bottom: 32px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #34c759;
    font-weight: 500;
    animation: slideDown 0.8s ease-out;
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

  .badge-dot {
    width: 8px;
    height: 8px;
    background: #34c759;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.2);
    }
  }

  .hero-title {
    font-family: 'Inter', sans-serif;
    font-size: 64px;
    font-weight: 700;
    line-height: 1.1;
    color: #ffffff;
    margin-bottom: 24px;
    letter-spacing: -1.5px;
  }


  .hero-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    line-height: 1.7;
    color: #9ca3af;
    max-width: 700px;
    margin: 0 auto 40px;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    animation: fadeIn 1.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .btn-primary, .btn-secondary {
    padding: 14px 32px;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    background: #228bff;
    color: #ffffff;
    border: none;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(34, 139, 255, 0.4);
  }

  .btn-primary:hover .btn-arrow {
    transform: translateX(4px);
  }

  .btn-arrow {
    transition: transform 0.3s;
    font-size: 20px;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .btn-large {
    padding: 18px 40px;
    font-size: 18px;
  }

  /* Stats Section */
  .stats-section {
    padding: 60px 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 40px 32px;
    text-align: center;
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
  }

  .stat-card.visible {
    opacity: 1;
    transform: translateY(0);
    animation: scaleIn 0.6s ease-out both;
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(30px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .stat-number {
    font-family: 'Inter', sans-serif;
    font-size: 48px;
    font-weight: 700;
    color: #228bff;
    margin-bottom: 12px;
    font-variant-numeric: tabular-nums;
  }

  .stat-label {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #9ca3af;
    font-weight: 500;
  }

  /* Section Headers */
  .section-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .section-tag {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(34, 139, 255, 0.1);
    border: 1px solid rgba(34, 139, 255, 0.3);
    border-radius: 50px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #228bff;
    font-weight: 600;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .section-header h2 {
    font-family: 'Inter', sans-serif;
    font-size: 48px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }

  /* Mission Section */
  .mission-section {
    padding: 80px 0;
  }

  .mission-content {
    display: grid;
    gap: 32px;
  }

  .mission-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 40px;
    backdrop-filter: blur(10px);
    transition: all 0.3s;
    animation: slideInLeft 0.8s ease-out both;
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

  .mission-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  }

  .main-mission {
    grid-column: 1 / -1;
  }

  .mission-icon {
    font-size: 48px;
    margin-bottom: 24px;
    filter: grayscale(1) opacity(0.8);
  }

  .mission-card h3 {
    font-family: 'Inter', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 16px;
  }

  .mission-card h4 {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 12px;
  }

  .mission-card p {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #9ca3af;
    margin-bottom: 16px;
  }

  .mission-card p:last-child {
    margin-bottom: 0;
  }

  .mission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .card-number {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #228bff;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  /* Features Section */
  .features-section {
    padding: 80px 0;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .feature-card {
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 40px 32px;
    backdrop-filter: blur(10px);
    overflow: hidden;
    transition: all 0.3s;
    animation: slideUp 0.8s ease-out both;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #228bff;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .feature-card:hover::before {
    opacity: 1;
  }

  .feature-card:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  }

  .feature-icon-wrapper {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    transition: all 0.3s;
    position: relative;
  }

  .feature-card:hover .feature-icon-wrapper {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 20px rgba(34, 139, 255, 0.3);
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    transition: transform 0.3s;
  }

  .feature-card:hover .feature-icon {
    transform: scale(1.1);
    filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(34, 139, 255, 0.6));
  }

  .feature-card h3 {
    font-family: 'Inter', sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 12px;
  }

  .feature-card p {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: #9ca3af;
    margin: 0;
  }

  .feature-shine {
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.03) 50%,
      transparent 70%
    );
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  .feature-card:hover .feature-shine {
    transform: translateX(100%);
  }

  /* Technology Section */
  .tech-section {
    padding: 80px 0;
  }

  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 32px;
  }

  .tech-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 48px 40px;
    text-align: center;
    backdrop-filter: blur(10px);
    transition: all 0.3s;
    animation: fadeIn 1s ease-out both;
  }

  .tech-card:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 16px 40px rgba(34, 139, 255, 0.2);
  }

  .tech-visual {
    position: relative;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
  }

  .tech-icon {
    font-size: 56px;
    position: relative;
    z-index: 2;
    filter: grayscale(1) opacity(0.9);
  }

  .pulse-ring {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 2px solid #228bff;
    border-radius: 50%;
    opacity: 0;
    animation: pulsate 2s ease-out infinite;
  }

  @keyframes pulsate {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  .orbit-container {
    position: absolute;
    width: 120px;
    height: 120px;
  }

  .orbit-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(139, 92, 246, 0.3);
    border-radius: 50%;
    animation: rotate 8s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .orbit-dot {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #8b5cf6;
    border-radius: 50%;
    top: 50%;
    left: 50%;
  }

  .orbit-dot-1 {
    animation: orbit1 3s linear infinite;
  }

  .orbit-dot-2 {
    animation: orbit2 3s linear infinite;
  }

  .orbit-dot-3 {
    animation: orbit3 3s linear infinite;
  }

  @keyframes orbit1 {
    from {
      transform: translate(-50%, -50%) rotate(0deg) translateX(60px);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg) translateX(60px);
    }
  }

  @keyframes orbit2 {
    from {
      transform: translate(-50%, -50%) rotate(120deg) translateX(60px);
    }
    to {
      transform: translate(-50%, -50%) rotate(480deg) translateX(60px);
    }
  }

  @keyframes orbit3 {
    from {
      transform: translate(-50%, -50%) rotate(240deg) translateX(60px);
    }
    to {
      transform: translate(-50%, -50%) rotate(600deg) translateX(60px);
    }
  }

  .data-bars {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 8px;
    height: 80px;
  }

  .data-bar {
    width: 12px;
    background: linear-gradient(to top, #34c759, #52c96f);
    border-radius: 6px;
    animation: barGrow 1.5s ease-in-out infinite;
  }

  @keyframes barGrow {
    0%, 100% {
      height: 30%;
    }
    50% {
      height: 80%;
    }
  }

  .tech-card h3 {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 16px;
  }

  .tech-card p {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: #9ca3af;
    margin: 0;
  }

  /* CTA Section */
  .cta-section {
    padding: 80px 0 40px;
  }

  .cta-card {
    background: linear-gradient(135deg, rgba(34, 139, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 32px;
    padding: 80px 60px;
    text-align: center;
    backdrop-filter: blur(10px);
    animation: fadeInScale 1s ease-out;
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

  .cta-card h2 {
    font-family: 'Inter', sans-serif;
    font-size: 42px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 16px;
  }

  .cta-card p {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    color: #9ca3af;
    margin-bottom: 32px;
  }

  /* Tablet Responsive */
  @media (max-width: 1024px) {
    .about-container {
      padding: 60px 1.5rem 40px;
    }

    .hero-section {
      padding: 40px 0 80px;
    }

    .hero-title {
      font-size: 52px;
    }

    .section-header h2 {
      font-size: 40px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .mission-grid {
      grid-template-columns: 1fr;
    }

    .features-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .tech-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .cta-card {
      padding: 60px 48px;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .about-container {
      padding: 60px 1rem 20px;
    }

    .hero-section {
      padding: 30px 0 60px;
    }

    .hero-badge {
      font-size: 13px;
      padding: 6px 12px;
      margin-bottom: 24px;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
    }

    .hero-title {
      font-size: 36px;
      margin-bottom: 20px;
      letter-spacing: -1px;
    }

    .hero-subtitle {
      font-size: 16px;
      margin-bottom: 32px;
    }

    .section-header {
      margin-bottom: 40px;
    }

    .section-tag {
      font-size: 12px;
      padding: 4px 12px;
    }

    .section-header h2 {
      font-size: 28px;
    }

    .hero-actions {
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .btn-primary, .btn-secondary {
      width: 100%;
      justify-content: center;
      padding: 12px 24px;
      font-size: 15px;
    }

    .stats-section {
      padding: 40px 0;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .stat-card {
      padding: 32px 24px;
    }

    .stat-number {
      font-size: 40px;
    }

    .stat-label {
      font-size: 14px;
    }

    .mission-section, .features-section, .tech-section {
      padding: 60px 0;
    }

    .mission-card {
      padding: 32px 24px;
    }

    .mission-icon {
      font-size: 40px;
      margin-bottom: 20px;
    }

    .mission-card h3 {
      font-size: 24px;
    }

    .mission-card h4 {
      font-size: 18px;
    }

    .mission-card p {
      font-size: 15px;
    }

    .mission-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .features-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .feature-card {
      padding: 32px 24px;
    }

    .feature-icon-wrapper {
      width: 64px;
      height: 64px;
      margin-bottom: 20px;
    }

    .feature-icon {
      width: 40px;
      height: 40px;
    }

    .feature-card h3 {
      font-size: 20px;
    }

    .feature-card p {
      font-size: 14px;
    }

    .tech-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .tech-card {
      padding: 40px 32px;
    }

    .tech-visual {
      height: 120px;
      margin-bottom: 24px;
    }

    .tech-icon {
      font-size: 48px;
    }

    .tech-card h3 {
      font-size: 20px;
    }

    .tech-card p {
      font-size: 14px;
    }

    .cta-section {
      padding: 60px 0 20px;
    }

    .cta-card {
      padding: 48px 24px;
      border-radius: 24px;
    }

    .cta-card h2 {
      font-size: 28px;
    }

    .cta-card p {
      font-size: 16px;
      margin-bottom: 24px;
    }

    .btn-large {
      padding: 14px 32px;
      font-size: 16px;
      width: 100%;
      justify-content: center;
    }

    .bg-grid {
      background-size: 30px 30px;
    }

    .bg-blur-top, .bg-blur-middle {
      display: none;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .hero-title {
      font-size: 32px;
    }

    .hero-subtitle {
      font-size: 15px;
    }

    .section-header h2 {
      font-size: 24px;
    }

    .btn-primary, .btn-secondary {
      font-size: 14px;
      padding: 10px 20px;
    }

    .stat-number {
      font-size: 36px;
    }

    .mission-card {
      padding: 24px 20px;
    }

    .feature-card {
      padding: 28px 20px;
    }

    .tech-card {
      padding: 32px 24px;
    }

    .cta-card {
      padding: 40px 20px;
    }

    .cta-card h2 {
      font-size: 24px;
    }

    .cta-card p {
      font-size: 15px;
    }
  }
</style>
