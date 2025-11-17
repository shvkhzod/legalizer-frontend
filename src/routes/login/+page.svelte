<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api/client';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    error = '';
    loading = true;

    try {
      const response = await api.login(email, password);
      authStore.login(response.user, response.accessToken, response.refreshToken);
      goto('/');
    } catch (err: any) {
      error = err.message || 'Login failed';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - Legal Compliance Checker</title>
</svelte:head>

<!-- Background decorations -->
<div class="bg-grid"></div>
<div class="bg-blur-top"></div>

<div class="auth-container">
  <div class="auth-card">
    <h1>Welcome Back</h1>
    <p class="subtitle">Log in to your account</p>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="you@example.com"
          required
          disabled={loading}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      <button type="submit" class="btn-primary" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>

    <div class="auth-footer">
      <p>Don't have an account? <a href="/register">Sign up</a></p>
    </div>
  </div>
</div>

<style>
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

  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  .auth-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 48px 40px;
    max-width: 420px;
    width: 100%;
    backdrop-filter: blur(10px);
  }

  h1 {
    font-family: 'Inter', sans-serif;
    font-size: 32px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
    text-align: center;
  }

  .subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    color: #9ca3af;
    margin-bottom: 32px;
  }

  .error-message {
    background: rgba(255, 59, 48, 0.1);
    border: 1px solid rgba(255, 59, 48, 0.3);
    color: #ff3b30;
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom: 24px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
  }

  .form-group {
    margin-bottom: 24px;
  }

  label {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #ffffff;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
  }

  input::placeholder {
    color: #6b7280;
  }

  input:focus {
    border-color: #228bff;
    background: rgba(255, 255, 255, 0.08);
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    width: 100%;
    padding: 12px 24px;
    margin-top: 8px;
    background: #228bff;
    border: none;
    border-radius: 12px;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    opacity: 0.9;
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .auth-footer {
    margin-top: 32px;
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .auth-footer p {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #9ca3af;
  }

  .auth-footer a {
    color: #228bff;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .auth-footer a:hover {
    opacity: 0.8;
  }

  /* Tablet Styles */
  @media (max-width: 1024px) {
    .auth-container {
      padding: 1.5rem;
    }

    .auth-card {
      padding: 40px 32px;
    }
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    .bg-grid {
      background-size: 30px 30px;
    }

    .bg-blur-top {
      display: none;
    }

    .auth-container {
      min-height: 70vh;
      padding: 1rem;
    }

    .auth-card {
      padding: 32px 24px;
      max-width: 100%;
      border-radius: 20px;
    }

    h1 {
      font-size: 28px;
    }

    .subtitle {
      font-size: 15px;
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      font-size: 13px;
    }

    input {
      padding: 11px 14px;
      font-size: 15px;
    }

    .btn-primary {
      padding: 11px 20px;
      font-size: 15px;
    }

    .auth-footer {
      margin-top: 24px;
      padding-top: 20px;
    }

    .auth-footer p {
      font-size: 13px;
    }
  }

  /* Small Mobile Styles */
  @media (max-width: 480px) {
    h1 {
      font-size: 24px;
    }

    .subtitle {
      font-size: 14px;
    }

    .auth-card {
      padding: 24px 20px;
    }

    input {
      font-size: 16px; /* Prevents zoom on iOS */
    }
  }
</style>
