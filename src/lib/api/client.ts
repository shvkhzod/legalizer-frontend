const API_URL = 'http://localhost:3001/api';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    fullName: string | null;
  };
}

export const api = {
  // Auth endpoints
  async register(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async logout(refreshToken: string): Promise<void> {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  },

  // Report endpoints
  async createReport(accessToken: string, report: any): Promise<{ success: boolean; reportId: number }> {
    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ report })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save report');
    }

    return response.json();
  },

  async getReports(accessToken: string, limit = 50, offset = 0): Promise<any> {
    const response = await fetch(`${API_URL}/reports?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }

    return response.json();
  },

  async getReport(accessToken: string, reportId: number): Promise<any> {
    const response = await fetch(`${API_URL}/reports/${reportId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }

    return response.json();
  },

  async deleteReport(accessToken: string, reportId: number): Promise<void> {
    const response = await fetch(`${API_URL}/reports/${reportId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete report');
    }
  }
};
