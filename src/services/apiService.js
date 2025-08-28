import axios from 'axios';

// API base URL - update this to match your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 second timeout
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          // Redirect to login if needed
          // window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== AUTH ENDPOINTS ====================

  async register(userData) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async logout() {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await this.api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  }

  async forgotPassword(email) {
    const response = await this.api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token, newPassword) {
    const response = await this.api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }

  // ==================== USER ENDPOINTS ====================

  async getUserProfile() {
    const response = await this.api.get('/users/profile');
    return response.data;
  }

  async updateUserProfile(userData) {
    const response = await this.api.put('/users/profile', userData);
    return response.data;
  }

  async connectWallet(walletAddress, signature) {
    const response = await this.api.post('/users/connect-wallet', {
      walletAddress,
      signature
    });
    return response.data;
  }

  async disconnectWallet() {
    const response = await this.api.post('/users/disconnect-wallet');
    return response.data;
  }

  async getUserDashboard() {
    const response = await this.api.get('/users/dashboard');
    return response.data;
  }

  async getUserReferrals() {
    const response = await this.api.get('/users/referrals');
    return response.data;
  }

  // ==================== PRESALE ENDPOINTS ====================

  async getPresaleInfo() {
    const response = await this.api.get('/presale/info');
    return response.data;
  }

  async calculateTokens(amount, currency = 'USD') {
    const response = await this.api.post('/presale/calculate', { amount, currency });
    return response.data;
  }

  async purchaseTokens(purchaseData) {
    const response = await this.api.post('/presale/purchase', purchaseData);
    return response.data;
  }

  async verifyPayment(transactionHash, paymentMethod) {
    const response = await this.api.post('/presale/verify-payment', {
      transactionHash,
      paymentMethod
    });
    return response.data;
  }

  async getUserTransactions(page = 1, limit = 10) {
    const response = await this.api.get(`/presale/transactions?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUserPresaleStats() {
    const response = await this.api.get('/presale/stats');
    return response.data;
  }

  async getPresaleLeaderboard() {
    const response = await this.api.get('/presale/leaderboard');
    return response.data;
  }

  async getCurrentPrices() {
    const response = await this.api.get('/presale/prices');
    return response.data;
  }

  async getNetworkInfo(network) {
    const response = await this.api.get(`/presale/network/${network}`);
    return response.data;
  }

  // ==================== KYC ENDPOINTS ====================

  async submitKyc(kycData) {
    const response = await this.api.post('/kyc/submit', kycData);
    return response.data;
  }

  async getKycStatus() {
    const response = await this.api.get('/kyc/status');
    return response.data;
  }

  async uploadKycDocument(file, documentType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await this.api.post('/kyc/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  // ==================== PAYMENT ENDPOINTS ====================

  async createPaymentIntent(amount, currency = 'usd') {
    const response = await this.api.post('/payments/create-intent', { amount, currency });
    return response.data;
  }

  async createCheckoutSession(items) {
    const response = await this.api.post('/payments/create-checkout', { items });
    return response.data;
  }

  async getPaymentStatus(paymentIntentId) {
    const response = await this.api.get(`/payments/status/${paymentIntentId}`);
    return response.data;
  }

  // ==================== ADMIN ENDPOINTS ====================

  async getAdminDashboard() {
    const response = await this.api.get('/admin/dashboard');
    return response.data;
  }

  async getAdminAnalytics() {
    const response = await this.api.get('/admin/analytics');
    return response.data;
  }

  async getAllUsers(page = 1, limit = 20, filters = {}) {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await this.api.get(`/admin/users?${queryParams}`);
    return response.data;
  }

  async updateUserRole(userId, role) {
    const response = await this.api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  async suspendUser(userId, reason) {
    const response = await this.api.post(`/admin/users/${userId}/suspend`, { reason });
    return response.data;
  }

  async getAllTransactions(page = 1, limit = 20, filters = {}) {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    const response = await this.api.get(`/admin/transactions?${queryParams}`);
    return response.data;
  }

  async getSystemSettings() {
    const response = await this.api.get('/admin/settings');
    return response.data;
  }

  async updateSystemSetting(key, value) {
    const response = await this.api.put(`/admin/settings/${key}`, { value });
    return response.data;
  }

  async updatePresalePhase(phaseNumber, phaseData) {
    const response = await this.api.put(`/admin/presale/phase/${phaseNumber}`, phaseData);
    return response.data;
  }

  async createPresalePhase(phaseData) {
    const response = await this.api.post('/admin/presale/phase', phaseData);
    return response.data;
  }

  // ==================== UTILITY METHODS ====================

  // Set authentication token
  setAuthToken(token, refreshToken = null) {
    localStorage.setItem('authToken', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Clear authentication tokens
  clearAuthTokens() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Get current user from token (basic implementation)
  getCurrentUser() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }

  // Handle file upload with progress
  async uploadFile(endpoint, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    const response = await this.api.post(endpoint, formData, config);
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;