import { apiAuth as api } from '../utils/api';

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  requires2FA: boolean;
}

interface RegisterRequest {
  email: string;
  password: string;
}

/**
 * Authentication service handling login, token management, and session state
 */
const authService = {
  /**
   * Authenticate user with username and password
   * @param credentials User credentials containing username and password
   * @returns Promise with login response containing auth tokens
   */
  login: async (credentials: LoginRequest): Promise<AuthTokens> => {
    try {
      const response = await api.post<AuthTokens>('/auth/login', credentials);
      if (response.data) {
        authService.storeTokens(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  register: async (credentials: RegisterRequest): Promise<boolean> => {
    try {
      const response = await api.post<RestResponse<void>>('/register', credentials);
      return response.status === 200;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Fetch current user's wallet information
   * @returns Promise with wallet data response
   */
  getWallet: async (): Promise<RestResponse<Wallet>> => {
    try {
      const response = await api.get<RestResponse<Wallet>>('/auth/wallet');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      throw error;
    }
  },
  

  /**
   * Refresh the access token using the refresh token
   * @returns Promise with new auth tokens
   */
  refreshAuth: async (): Promise<RestResponse<AuthTokens>> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<RestResponse<AuthTokens>>('/auth/refresh', {
        refreshToken
      });

      if (response.data.data) {
        authService.storeTokens(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      authService.clearTokens();
      throw error;
    }
  },

  /**
   * Store authentication tokens in localStorage
   * @param tokens Auth tokens to store
   */
  storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  /**
   * Clear stored authentication tokens
   */
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  /**
   * Get the stored access token
   * @returns The access token or null if not found
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  /**
   * Check if the user is authenticated
   * @returns true if user has a valid access token
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    console.log("Get token: ", token);
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Token valid? ", payload.exp * 1000 > Date.now());
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  /**
   * Validate and handle potentially invalid tokens
   * @returns Promise<boolean> indicating if tokens are valid
   */
  validateTokens: async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // If no tokens exist, they're invalid
    if (!accessToken || !refreshToken) {
      authService.clearTokens();
      return false;
    }
    
    try {
      // Check if access token is expired
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const isExpired = payload.exp * 1000 <= Date.now();
      
      if (isExpired) {
        console.log("Token expired, refreshing...");
        // Try to refresh the token
        await authService.refreshAuth();
      }
      
      return true;
    } catch (error) {
      // If any error occurs during validation/refresh, clear tokens
      console.error('Token validation failed:', error);
      authService.clearTokens();
      return false;
    }
  },

  /**
   * Logout the user by clearing stored tokens
   */
  logout(): void {
    this.clearTokens();
  }
};

export default authService;