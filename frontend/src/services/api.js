import axios from 'axios';

// 修复 API URL 配置
const getApiUrl = () => {
    return import.meta.env.VITE_API_URL ||
           (typeof window !== 'undefined'
               ? 'http://localhost:5000/api'
               : 'http://backend:5000/api');
};

const apiClient = axios.create({
    baseURL: getApiUrl(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin';
        }
        return Promise.reject(error);
    }
);

export const api = {
    // Contestants
    async getContestants() {
        try {
            const response = await apiClient.get('/contestants');
            return response.data;
        } catch (error) {
            console.error('Get contestants error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch contestants');
        }
    },

    async getContestant(id) {
        try {
            const response = await apiClient.get(`/contestants/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch contestant');
        }
    },

    async createContestant(formData) {
        try {
            const response = await apiClient.post('/contestants', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create contestant');
        }
    },

    async updateContestant(id, formData) {
        try {
            const response = await apiClient.put(`/contestants/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update contestant');
        }
    },

    async deleteContestant(id) {
        try {
            const response = await apiClient.delete(`/contestants/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete contestant');
        }
    },

    // Voting
    async sendVerificationCode(email, contestantId) {
        try {
            const response = await apiClient.post('/votes/send-verification', {
                email,
                contestantId
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send verification code');
        }
    },

    async verifyAndVote(email, contestantId, verificationCode) {
        try {
            const response = await apiClient.post('/votes/verify-and-vote', {
                email,
                contestantId,
                verificationCode
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to verify and vote');
        }
    },

    // Admin
    async adminLogin(email, password) {
        try {
            const response = await apiClient.post('/admin/login', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    async getAdminDashboard() {
        try {
            const response = await apiClient.get('/admin/dashboard');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
    },

    async resetVotes() {
        try {
            const response = await apiClient.post('/admin/reset-votes');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to reset votes');
        }
    },

    async updateAdminSettings(settings) {
        try {
            const response = await apiClient.put('/admin/settings', settings);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update settings');
        }
    }
};