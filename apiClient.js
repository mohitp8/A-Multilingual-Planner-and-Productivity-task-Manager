// Single API client. All private requests use the authenticated session token.
const API_URL = `${window.location.origin}/api/v1`;

const apiClient = {
    async request(endpoint, method = 'GET', data = null) {
        const token = localStorage.getItem('accessToken');
        const headers = {};
        if (data !== null) headers['Content-Type'] = 'application/json';
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const config = { method, headers, cache: 'no-store' };
        if (data !== null) config.body = JSON.stringify(data);

        const res = await fetch(`${API_URL}${endpoint}`, config);
        const payload = await res.json().catch(() => null);

        if (res.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('hitmo_user');
            if (!location.pathname.endsWith('/login.html')) location.replace('/login.html');
            throw new Error(payload?.error?.message || 'Session expired. Please log in again.');
        }
        if (!res.ok || payload?.success === false) {
            throw new Error(payload?.error?.message || 'API request failed.');
        }
        return payload?.data ?? payload;
    }
};
