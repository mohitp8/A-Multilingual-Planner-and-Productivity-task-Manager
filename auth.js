// Central authentication for Hitmo Planner.
// The server is the source of truth; localStorage only keeps the session token.
class AuthManager {
    constructor() {
        this.user = null;
        this.baseUrl = `${window.location.origin}/api/v1`;
    }

    async isAuthenticated() {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            this.user = null;
            return false;
        }
        return await this.refreshUserContext();
    }

    async getMe() {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        try {
            const res = await fetch(`${this.baseUrl}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store'
            });
            if (!res.ok) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('hitmo_user');
                return null;
            }
            const data = await res.json();
            return data.success ? data.data : null;
        } catch {
            return null;
        }
    }

    async login(email, password) {
        try {
            const res = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
                return { success: false, error: data?.error?.message || 'Invalid email or password.' };
            }
            localStorage.setItem('accessToken', data.data.accessToken);
            this.user = data.data.user;
            await this.syncPreferences(data.data.accessToken);
            localStorage.setItem('hitmo_user', JSON.stringify({ ...this.user, authenticated: true }));
            return { success: true, user: this.user };
        } catch {
            return { success: false, error: 'Cannot connect to the server. Please start Hitmo Planner and try again.' };
        }
    }

    async register(name, email, password) {
        try {
            const res = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), password, language: localStorage.getItem('hitmo_lang') || 'en' })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
                return { success: false, error: data?.error?.message || 'Registration failed.' };
            }
            localStorage.setItem('accessToken', data.data.accessToken);
            this.user = data.data.user;
            await this.syncPreferences(data.data.accessToken);
            localStorage.setItem('hitmo_user', JSON.stringify({ ...this.user, authenticated: true }));
            return { success: true, user: this.user };
        } catch {
            return { success: false, error: 'Cannot connect to the server. Please start Hitmo Planner and try again.' };
        }
    }

    async logout() {
        const token = localStorage.getItem('accessToken');
        try {
            if (token) {
                await fetch(`${this.baseUrl}/auth/logout`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch {}
        localStorage.removeItem('accessToken');
        localStorage.removeItem('hitmo_user');
        localStorage.removeItem('hitmo_notifications_shown');
        this.user = null;
        if (window.AppState) {
            window.AppState.tasks = [];
            if (window.AppState.selectedTasks) window.AppState.selectedTasks.clear();
        }
        window.location.replace('/login.html');
    }

    async syncPreferences(token = localStorage.getItem('accessToken')) {
        if (!token) return;
        try {
            const res = await fetch(`${this.baseUrl}/preferences`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
            const data = await res.json().catch(() => null);
            if (res.ok && data?.success && data.data) {
                if (data.data.language) localStorage.setItem('hitmo_lang', data.data.language);
                if (data.data.theme) localStorage.setItem('theme', data.data.theme);
            }
        } catch {}
    }

    async refreshUserContext() {
        const user = await this.getMe();
        this.user = user;
        if (user) localStorage.setItem('hitmo_user', JSON.stringify({ ...user, authenticated: true }));
        return !!user;
    }

    getUser() { return this.user; }
}

const authManager = new AuthManager();
