<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api/client';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  async function handleLogout() {
    const currentStore = { ...$authStore };
    if (currentStore.refreshToken) {
      try {
        await api.logout(currentStore.refreshToken);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    authStore.logout();
    goto('/login');
  }

  function isActive(path: string): boolean {
    return $page.url.pathname === path;
  }
</script>

<header>
  <div class="container">
    <a href="/" class="logo">
      <img src="/logo.svg" alt="Logo" />
    </a>
    <div class="nav-group">
      <a href="/" class="nav-link" class:active={isActive('/')}>Home</a>
      {#if $authStore.isAuthenticated}
        <a href="/reports" class="nav-link" class:active={isActive('/reports')}>Reports</a>
      {/if}
      <a href="/about" class="nav-link" class:active={isActive('/about')}>About</a>
    </div>
    <div class="auth-buttons">
      {#if $authStore.isAuthenticated}
        <span class="user-name">{$authStore.user?.fullName || $authStore.user?.email?.split('@')[0] || 'User'}</span>
        <button class="btn-logout" on:click={handleLogout}>Log out</button>
      {:else}
        <a href="/login" class="btn-login">Log in</a>
        <a href="/register" class="btn-signup">Sign up</a>
      {/if}
    </div>
  </div>
</header>

<style>
  header {
    background-color: transparent;
    padding: 38px 0 0 0;
    position: relative;
    z-index: 100;
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

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 17px;
    flex-shrink: 0;
    transition: all 0.3s;
    text-decoration: none;
    backdrop-filter: blur(10px);
  }

  .logo:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 139, 255, 0.2);
  }

  .logo img {
    height: 28px;
    width: auto;
    filter: brightness(0) invert(1);
    transition: transform 0.3s;
  }

  .logo:hover img {
    transform: scale(1.1);
  }

  .nav-group {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 17px;
    height: 56px;
    padding: 0 8px;
    gap: 4px;
    backdrop-filter: blur(10px);
  }

  .nav-link {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #9ca3af;
    text-decoration: none;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    border-radius: 12px;
    transition: all 0.3s;
    white-space: nowrap;
    position: relative;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 60%;
    height: 2px;
    background: #228bff;
    border-radius: 2px;
    transition: transform 0.3s;
  }

  .nav-link:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
  }

  .nav-link.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }

  .nav-link.active::after {
    transform: translateX(-50%) scaleX(1);
  }

  .auth-buttons {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 17px;
    height: 56px;
    padding: 11px;
    gap: 8px;
    flex-shrink: 0;
    backdrop-filter: blur(10px);
  }

  .user-name {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    padding: 0 12px;
    white-space: nowrap;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn-logout, .btn-login {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 0 18px;
    height: 34px;
    line-height: 34px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .btn-logout::before, .btn-login::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    transform: translate(-50%, -50%);
    transition: width 0.4s, height 0.4s;
  }

  .btn-logout:hover::before, .btn-login:hover::before {
    width: 150px;
    height: 150px;
  }

  .btn-logout:hover, .btn-login:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  .btn-logout:active, .btn-login:active {
    transform: translateY(0);
  }

  .btn-signup {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 0 24px;
    height: 34px;
    line-height: 34px;
    border-radius: 12px;
    background: #228bff;
    color: #ffffff;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .btn-signup::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.4s, height 0.4s;
  }

  .btn-signup:hover::before {
    width: 150px;
    height: 150px;
  }

  .btn-signup:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 139, 255, 0.4);
  }

  .btn-signup:active {
    transform: translateY(0);
  }

  /* Tablet Styles */
  @media (max-width: 1024px) {
    .container {
      padding: 0 1.5rem;
    }

    .nav-link {
      padding: 0 14px;
      font-size: 14px;
    }

    .user-name {
      max-width: 120px;
    }
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    header {
      padding: 24px 0 0 0;
    }

    .container {
      gap: 12px;
      flex-wrap: wrap;
      padding: 0 1rem;
    }

    .logo {
      width: 48px;
      height: 48px;
    }

    .logo img {
      height: 24px;
    }

    .nav-group {
      order: 3;
      width: 100%;
      justify-content: center;
      height: 48px;
      padding: 0 6px;
    }

    .nav-link {
      padding: 0 12px;
      font-size: 13px;
      height: 36px;
      line-height: 36px;
    }

    .auth-buttons {
      padding: 8px;
      gap: 6px;
      height: 48px;
    }

    .user-name {
      max-width: 80px;
      font-size: 12px;
      padding: 0 8px;
    }

    .btn-logout, .btn-login, .btn-signup {
      font-size: 12px;
      padding: 0 12px;
      height: 32px;
      line-height: 32px;
    }
  }

  /* Small Mobile Styles */
  @media (max-width: 480px) {
    .container {
      gap: 8px;
    }

    .nav-link {
      padding: 0 10px;
      font-size: 12px;
    }

    .user-name {
      display: none;
    }

    .btn-logout, .btn-login {
      padding: 0 16px;
    }

    .btn-signup {
      padding: 0 20px;
    }
  }
</style>
