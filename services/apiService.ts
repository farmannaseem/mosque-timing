import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

class ApiService {
    private baseUrl: string;
    private token: string | null = null;

    constructor() {
        this.baseUrl = API_URL;
        this.loadToken();
    }

    private async loadToken() {
        try {
            this.token = await AsyncStorage.getItem('auth_token');
        } catch (error) {
            console.error('Error loading token:', error);
        }
    }

    private async getHeaders(includeAuth: boolean = true): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    private async handleResponse(response: Response) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'An error occurred');
        }

        return data;
    }

    async setToken(token: string) {
        this.token = token;
        await AsyncStorage.setItem('auth_token', token);
    }

    async clearToken() {
        this.token = null;
        await AsyncStorage.removeItem('auth_token');
    }

    // Authentication
    async registerImam(
        email: string,
        password: string,
        mosqueName: string,
        mosqueAddress: string,
        imamName: string
    ) {
        const response = await fetch(`${this.baseUrl}/api/auth/register-imam`, {
            method: 'POST',
            headers: await this.getHeaders(false),
            body: JSON.stringify({
                email,
                password,
                mosqueName,
                mosqueAddress,
                imamName,
            }),
        });

        const data = await this.handleResponse(response);
        if (data.token) {
            await this.setToken(data.token);
        }
        return data;
    }

    async registerUser(email: string, password: string) {
        const response = await fetch(`${this.baseUrl}/api/auth/register-user`, {
            method: 'POST',
            headers: await this.getHeaders(false),
            body: JSON.stringify({ email, password }),
        });

        const data = await this.handleResponse(response);
        if (data.token) {
            await this.setToken(data.token);
        }
        return data;
    }

    async login(email: string, password: string) {
        const response = await fetch(`${this.baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: await this.getHeaders(false),
            body: JSON.stringify({ email, password }),
        });

        const data = await this.handleResponse(response);
        if (data.token) {
            await this.setToken(data.token);
        }
        return data;
    }

    // Mosques
    async getMosques(search?: string, page: number = 1, limit: number = 50) {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const response = await fetch(
            `${this.baseUrl}/api/mosques?${params.toString()}`,
            {
                headers: await this.getHeaders(false),
            }
        );

        return this.handleResponse(response);
    }

    async getMosque(id: string) {
        const response = await fetch(`${this.baseUrl}/api/mosques/${id}`, {
            headers: await this.getHeaders(false),
        });

        return this.handleResponse(response);
    }

    async updateTimings(mosqueId: string, timings: any) {
        const response = await fetch(
            `${this.baseUrl}/api/mosques/${mosqueId}/timings`,
            {
                method: 'PUT',
                headers: await this.getHeaders(true),
                body: JSON.stringify({ timings }),
            }
        );

        return this.handleResponse(response);
    }

    async updateMosque(mosqueId: string, updates: any) {
        const response = await fetch(`${this.baseUrl}/api/mosques/${mosqueId}`, {
            method: 'PUT',
            headers: await this.getHeaders(true),
            body: JSON.stringify(updates),
        });

        return this.handleResponse(response);
    }

    // Notifications
    async registerPushToken(token: string, mosqueId?: string, platform: string = 'android') {
        const body: any = { token, platform };
        if (mosqueId) body.mosqueId = mosqueId;

        const response = await fetch(
            `${this.baseUrl}/api/notifications/register-token`,
            {
                method: 'POST',
                headers: await this.getHeaders(true), // Include auth if available
                body: JSON.stringify(body),
            }
        );

        return this.handleResponse(response);
    }

    async unregisterPushToken(token: string, mosqueId: string) {
        const response = await fetch(
            `${this.baseUrl}/api/notifications/unregister-token`,
            {
                method: 'DELETE',
                headers: await this.getHeaders(false),
                body: JSON.stringify({ token, mosqueId }),
            }
        );

        return this.handleResponse(response);
    }

    async getNotificationStats(mosqueId: string) {
        const response = await fetch(
            `${this.baseUrl}/api/notifications/stats/${mosqueId}`,
            {
                headers: await this.getHeaders(true),
            }
        );

        return this.handleResponse(response);
    }

    // Health check
    async healthCheck() {
        const response = await fetch(`${this.baseUrl}/health`);
        return this.handleResponse(response);
    }
}

export default new ApiService();
